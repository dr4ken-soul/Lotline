import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import YAML from "yaml";

const root = process.cwd();
const flowPath = resolve(root, "kestra/flows/cold-chain-excursion-lot-review.yaml");
const flow = YAML.parse(readFileSync(flowPath, "utf8"));

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
  const types = flow.tasks.map((task) => task.type);
  assert.ok(flow.triggers.some((trigger) => trigger.type === "io.kestra.plugin.core.trigger.Webhook"));
  assert.ok(types.includes("io.kestra.plugin.core.flow.If"));
  assert.ok(types.includes("io.kestra.plugin.openai.ChatCompletion"));
  assert.ok(types.includes("io.kestra.plugin.core.flow.Pause"));
  assert.ok(types.length >= 3);
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
