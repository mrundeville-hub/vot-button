// Pure fetch/retry logic, extracted so it can be unit-tested in node.

export const FALLBACK_WORKERS = [
  "https://vot-worker.toil.cc",
  "https://vot-worker-s1.toil.cc",
];

// Fetch with retry and fallback workers
// ponytail: _sleep is injectable only so tests don't wait on real backoff
export async function fetchTranslation(videoUrl, retries = 2, _sleep = (ms) => new Promise(r => setTimeout(r, ms))) {
  const errors = [];

  for (const worker of FALLBACK_WORKERS) {
    for (let i = 0; i <= retries; i++) {
      try {
        console.log("[VOT Button]", `Trying worker: ${worker}, attempt ${i + 1}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${worker}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: videoUrl,
            from: "en",
            to: "ru",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("[VOT Button]", "Translation response:", data);
        return data;

      } catch (err) {
        errors.push(`${worker}: ${err.message}`);
        console.warn("[VOT Button]", `Attempt ${i + 1} failed:`, err.message);
        if (i < retries) await _sleep(1000 * (i + 1));
      }
    }
  }

  throw new Error("All workers failed: " + errors.join("; "));
}
