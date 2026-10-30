import assert from "node:assert/strict";
import test from "node:test";
import { readLimitedRequestBody } from "./request-body.ts";

test("reads a body that stays within the byte limit", async () => {
  const request = new Request("https://lotline.test/api/demo/run", { method: "POST", body: "{\"fixtureId\":\"excursion-01\"}" });
  assert.equal(await readLimitedRequestBody(request, 1_024), "{\"fixtureId\":\"excursion-01\"}");
});

test("rejects a body above the byte limit", async () => {
  const request = new Request("https://lotline.test/api/demo/run", { method: "POST", body: "12345" });
  assert.equal(await readLimitedRequestBody(request, 4), null);
});

test("rejects an oversized declared body before reading it", async () => {
  const request = new Request("https://lotline.test/api/demo/run", {
    method: "POST",
    headers: { "content-length": "5" },
    body: "12345",
  });
  assert.equal(await readLimitedRequestBody(request, 4), null);
});
