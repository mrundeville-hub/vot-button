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
};

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
  if (msg?.type === "openOptions") {
    openSettings();
    sendResponse({ ok: true });
    return true;
  }
});
