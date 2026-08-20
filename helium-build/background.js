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
  // Helium/Chromium: openOptionsPage can fail; fall back to a real tab
  chrome.runtime.openOptionsPage().catch(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const cur = await chrome.storage.local.get(null);
  const patch = {};
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (cur[k] === undefined) patch[k] = v;
  }
  if (Object.keys(patch).length) await chrome.storage.local.set(patch);
});

chrome.action.onClicked.addListener(openSettings);

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "openOptions") {
    openSettings();
    sendResponse({ ok: true });
    return true;
  }
});
