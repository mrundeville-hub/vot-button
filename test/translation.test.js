// Plain-node tests for the retry/fallback logic in src/translation.js
// Run: npm test
import assert from "node:assert/strict";
import { fetchTranslation, FALLBACK_WORKERS } from "../src/translation.js";

const noSleep = () => Promise.resolve();
const ok = (body) => ({ ok: true, json: async () => body });
const fail = { ok: false, status: 500, statusText: "boom" };

// 1. Success on first attempt returns data, hits first worker
{
  const calls = [];
  globalThis.fetch = async (url) => { calls.push(url); return ok({ url: "audio.mp3" }); };
  const data = await fetchTranslation("https://youtube.com/watch?v=x", 2, noSleep);
  assert.equal(data.url, "audio.mp3");
  assert.deepEqual(calls, [`${FALLBACK_WORKERS[0]}/translate`]);
}

// 2. First worker fails all retries, falls back to second worker
{
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return url.startsWith(FALLBACK_WORKERS[0]) ? fail : ok({ url: "fallback.mp3" });
  };
  const data = await fetchTranslation("u", 2, noSleep);
  assert.equal(data.url, "fallback.mp3");
  assert.equal(calls.length, 4); // 3 attempts on worker 1, 1 on worker 2
}

// 3. All workers fail -> throws with aggregated errors
{
  globalThis.fetch = async () => fail;
  await assert.rejects(
    () => fetchTranslation("u", 0, noSleep),
    /All workers failed: .*HTTP 500/,
  );
}

// 4. retries=0 means exactly one attempt per worker
{
  let n = 0;
  globalThis.fetch = async () => { n++; return fail; };
  await fetchTranslation("u", 0, noSleep).catch(() => {});
  assert.equal(n, FALLBACK_WORKERS.length);
}

console.log("translation.test.js: all tests passed");
