// ponytail: `browser` (Firefox/Safari, promises) else `chrome` (Chromium)
const api = globalThis.browser ?? globalThis.chrome;
const STORE = api.storage.local;
const FIELDS = [
  "autoTranslate",
  "voiceMode",
  "buttonPosition",
  "sourceLang",
  "targetLang",
  "showVolume",
  "translationVolume",
];
const DEFAULTS = {
  autoTranslate: false,
  voiceMode: "live",
  buttonPosition: "default",
  sourceLang: "en",
  targetLang: "ru",
  showVolume: true,
  translationVolume: 100,
};

function setVolumeLabel(v) {
  const el = document.getElementById("volumeLabel");
  if (el) el.textContent = `${v}%`;
}

async function load() {
  const data = await STORE.get(DEFAULTS);
  for (const key of FIELDS) {
    const el = document.getElementById(key);
    if (!el) continue;
    const val = data[key] ?? DEFAULTS[key];
    if (el.type === "checkbox") el.checked = val !== false;
    else if (el.type === "range") {
      el.value = String(val);
      setVolumeLabel(Number(val));
    } else el.value = val;
  }
}

function bind() {
  for (const key of FIELDS) {
    const el = document.getElementById(key);
    if (!el) continue;
    const event = el.type === "range" ? "input" : "change";
    el.addEventListener(event, async () => {
      let val;
      if (el.type === "checkbox") val = el.checked;
      else if (el.type === "range") {
        val = Number(el.value);
        setVolumeLabel(val);
      } else val = el.value;
      await STORE.set({ [key]: val });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  bind();
});
