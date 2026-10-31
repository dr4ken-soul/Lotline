import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import YAML from "yaml";

const root = process.cwd();
const flowPath = resolve(root, "kestra/flows/cold-chain-excursion-lot-review.yaml");
const flow = YAML.parse(readFileSync(flowPath, "utf8"));
const evaluator = flow.tasks.find((task) => task.id === "evaluate_event");
const draftMode = flow.tasks.find((task) => task.id === "draft_mode");
const externalDraftValidator = draftMode.then.find((task) => task.id === "validate_external_draft");

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function runKestraPython(script, environments) {
  const runner = [
    "import json, sys, types",
    "results = []",
    "class KestraStub:",
    "    @staticmethod",
    "    def outputs(value):",
    "        results.append(value)",
    "sys.modules['kestra'] = types.SimpleNamespace(Kestra=KestraStub)",
    `script = ${JSON.stringify(script)}`,
    `environments = ${JSON.stringify(environments)}`,
    "for environment in environments:",
    "    __import__('os').environ.update(environment)",
    "    exec(script, {})",
    "print(json.dumps(results))",
  ].join("\n");
  const result = spawnSync("python", ["-c", runner], {
    encoding: "utf8",
    env: process.env,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  return JSON.parse(result.stdout.trim());
}

test("blueprint has current catalog metadata and canonical sections", () => {
  assert.equal(flow.id, "cold-chain-excursion-lot-review");
  assert.equal(flow.namespace, "lotline.demo");
  assert.equal(flow.extend.demo, false);
  assert.equal(flow.extend.ee, false);
  assert.ok(flow.extend.metaDescription.length <= 160);
  for (const section of [
    "## How it works", "## What you get", "## Who it's for",
    "## Why orchestrate this with Kestra", "## Prerequisites", "### Secrets",
    "## Inputs", "## Outputs", "## Quick start", "## How to extend", "## Links",
  ]) assert.ok(flow.extend.description.includes(section), `missing ${section}`);
});

test("blueprint includes a trigger, flow control, non-core plugin, and human pause", () => {
  const taskTypes = (tasks) => tasks.flatMap((task) => [
    task.type,
    ...taskTypes(task.then ?? []),
    ...taskTypes(task.else ?? []),
  ]);
  const types = taskTypes(flow.tasks);
  assert.ok(flow.triggers.some((trigger) => trigger.type === "io.kestra.plugin.core.trigger.Webhook"));
  assert.ok(types.includes("io.kestra.plugin.core.flow.If"));
  assert.ok(types.includes("io.kestra.plugin.openai.ChatCompletion"));
  assert.ok(types.includes("io.kestra.plugin.core.flow.Pause"));
  assert.ok(types.length >= 3);
});

test("external AI is gated by the complete canonical synthetic fixture", () => {
  const fixture = JSON.parse(readFileSync(resolve(root, "web/data/demo/excursion-01.json"), "utf8"));
  const fixtureHash = createHash("sha256").update(canonicalJson(fixture)).digest("hex");
  const expectedHash = evaluator.script.match(/fixture_fingerprint == "([a-f0-9]{64})"/)?.[1];
  const changedFixture = structuredClone(fixture);
  changedFixture.readings[1].value += 0.1;
  const [verified, spoofed] = runKestraPython(evaluator.script, [
    { WEBHOOK_BODY: JSON.stringify({ ...fixture, aiMode: "external_synthetic" }), INPUT_JSON: "null" },
    { WEBHOOK_BODY: JSON.stringify({ ...changedFixture, aiMode: "external_synthetic" }), INPUT_JSON: "null" },
  ]);

  assert.equal(expectedHash, fixtureHash, "the flow fingerprint must match the shipped fixture");
  assert.equal(verified.syntheticFixtureVerified, true);
  assert.equal(spoofed.syntheticFixtureVerified, false, "altered readings with a copied fixture ID must fail verification");
  assert.equal(spoofed.syntheticFixtureId, "");
  assert.match(evaluator.script, /fixture_candidate\.pop\("aiMode", None\)/);
  assert.match(draftMode.condition, /syntheticFixtureVerified == true/);
});

test("external model drafts require non-empty unique citations from the evidence allowlist", () => {
  const evaluation = { templateDraft: "Use the deterministic source-linked summary.", evidenceIds: ["EVT-017", "POL-02"] };
  const citations = [["EVT-017"], [], ["UNKNOWN"], ["EVT-017", "EVT-017"]];
  const [valid, empty, unknown, duplicate] = runKestraPython(externalDraftValidator.script, citations.map((items) => ({
    EVALUATION_JSON: JSON.stringify(evaluation),
    MODEL_TEXT: JSON.stringify({ text: "Review the observed event.", citations: items }),
  })));

  assert.equal(valid.draftMode, "external_synthetic");
  assert.equal(empty.draftMode, "template_fallback", "an empty citation list must use the template");
  assert.equal(unknown.draftMode, "template_fallback", "an unknown citation must use the template");
  assert.equal(duplicate.draftMode, "template_fallback", "duplicate citations must use the template");
});

test("local environment stays private and any present signing key is populated", () => {
  const envPath = resolve(root, ".env");
  assert.ok(!existsSync(resolve(root, ".env.example")));
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, "utf8");
    const signingKey = env.match(/^LOTLINE_DEMO_SIGNING_KEY=(.+)$/m)?.[1]?.trim();
    assert.ok(signingKey && signingKey.length >= 40);
    assert.ok(!env.includes("LOTLINE_AI_API_KEY="));
  }
  const gitignore = readFileSync(resolve(root, ".gitignore"), "utf8");
  const ignoredEntries = gitignore.split(/\r?\n/);
  assert.ok(ignoredEntries.includes(".env") && !ignoredEntries.includes("!.env.example"));
});
