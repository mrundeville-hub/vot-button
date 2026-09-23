// ponytail: `browser` (Firefox/Safari, promises) else `chrome` (Chromium) — one line beats a polyfill dep
const api = globalThis.browser ?? globalThis.chrome;

const DEFAULTS = {
  autoTranslate: false,
  subtitles: "dual",
  voiceMode: "live",
  buttonPosition: "default",
  sourceLang: "en",
  targetLang: "ru",
  showVolume: true,
  translationVolume: 100,
  buttonOffset: { x: 0.5, y: 0 },
};

// MV3 content scripts have the page's CORS limits. Fetch the VOT worker from
// the extension background, where manifest host permissions apply.
const WORKER_HOSTS = new Set(["vot-worker.eu.cc", "vot-worker.vtrans.eu.cc"]);
async function fetchWorker({ url, method = "POST", headers = {}, body }) {
  const target = new URL(url);
  if (target.protocol !== "https:" || target.port || target.username || target.password || !WORKER_HOSTS.has(target.hostname)) {
    throw new Error("Worker URL is not allowed");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(target.href, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
    return {
      status: response.status,
      bytes: Array.from(new Uint8Array(await response.arrayBuffer())),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function openSettings() {
  // openOptionsPage may reject (or not exist) — fall back to a real tab
  Promise.resolve()
    .then(() => api.runtime.openOptionsPage())
    .catch(() => api.tabs.create({ url: api.runtime.getURL("options.html") }));
}

api.runtime.onInstalled.addListener(async () => {
  const cur = await api.storage.local.get(null);
  const patch = {};
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (cur[k] === undefined) patch[k] = v;
  }
  if (Object.keys(patch).length) await api.storage.local.set(patch);
});

api.action.onClicked.addListener(openSettings);

api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "fetchWorker") {
    fetchWorker(msg)
      .then((result) => sendResponse({ ok: true, ...result }))
      .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  }
  if (msg?.type === "openOptions") {
    openSettings();
    sendResponse({ ok: true });
    return true;
  }
});
