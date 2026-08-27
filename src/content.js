// Voice Over Translation — content script (source; bundle → build/content.js)
import { VOTWorkerClient } from "@vot.js/core";

const WORKERS = ["vot-worker.eu.cc", "vot-worker.vtrans.eu.cc"];
// ponytail: `browser` (Firefox/Safari, promises) else `chrome` (Chromium)
const api = globalThis.browser ?? globalThis.chrome;
const STORE = api.storage.local;
const DEFAULTS = {
  voiceMode: "live",
  buttonPosition: "default",
  sourceLang: "en",
  targetLang: "ru",
  showVolume: true,
  translationVolume: 100,
  autoTranslate: false,
  subtitles: "dual", // off | dual | en | ru
};

const ICONS = {
  translate: `<svg width="24" height="24" viewBox="0 0 24 24"><g id="vot-translate-icon"><path fill-rule="evenodd" d="M15.778 18.95L14.903 21.375C14.8364 21.5583 14.7197 21.7083 14.553 21.825C14.3864 21.9417 14.203 22 14.003 22C13.6697 22 13.3989 21.8625 13.1905 21.5875C12.9822 21.3125 12.9447 21.0083 13.078 20.675L16.878 10.625C16.9614 10.4417 17.0864 10.2917 17.253 10.175C17.4197 10.0583 17.603 10 17.803 10H18.553C18.753 10 18.9364 10.0583 19.103 10.175C19.2697 10.2917 19.3947 10.4417 19.478 10.625L23.278 20.7C23.4114 21.0167 23.378 21.3125 23.178 21.5875C22.978 21.8625 22.7114 22 22.378 22C22.1614 22 21.9739 21.9375 21.8155 21.8125C21.6572 21.6875 21.5364 21.525 21.453 21.325L20.628 18.95H15.778ZM19.978 17.2H16.378L18.228 12.25L19.978 17.2Z"/><path d="M9 14L4.7 18.3C4.51667 18.4833 4.28333 18.575 4 18.575C3.71667 18.575 3.48333 18.4833 3.3 18.3C3.11667 18.1167 3.025 17.8833 3.025 17.6C3.025 17.3167 3.11667 17.0833 3.3 16.9L7.65 12.55C7.01667 11.85 6.4625 11.125 5.9875 10.375C5.5125 9.625 5.1 8.83333 4.75 8H6.85C7.15 8.6 7.47083 9.14167 7.8125 9.625C8.15417 10.1083 8.56667 10.6167 9.05 11.15C9.78333 10.35 10.3917 9.52917 10.875 8.6875C11.3583 7.84583 11.7667 6.95 12.1 6H2C1.71667 6 1.47917 5.90417 1.2875 5.7125C1.09583 5.52083 1 5.28333 1 5C1 4.71667 1.09583 4.47917 1.2875 4.2875C1.47917 4.09583 1.71667 4 2 4H8V3C8 2.71667 8.09583 2.47917 8.2875 2.2875C8.47917 2.09583 8.71667 2 9 2C9.28333 2 9.52083 2.09583 9.7125 2.2875C9.90417 2.47917 10 2.71667 10 3V4H16C16.2833 4 16.5208 4.09583 16.7125 4.2875C16.9042 4.47917 17 5.28333 17 5C17 5.28333 16.9042 5.52083 16.7125 5.7125C16.5208 5.90417 16.2833 6 16 6H14.1C13.75 7.18333 13.275 8.33333 12.675 9.45C12.075 10.5667 11.3333 11.6167 10.45 12.6L12.85 15.05L12.1 17.1L9 14Z"/></g><path id="vot-loading-icon" style="display:none" d="M19.8081 16.3697L18.5842 15.6633V13.0832C18.5842 12.9285 18.5228 12.7801 18.4134 12.6707C18.304 12.5613 18.1556 12.4998 18.0009 12.4998C17.8462 12.4998 17.6978 12.5613 17.5884 12.6707C17.479 12.7801 17.4176 12.9285 17.4176 13.0832V15.9998C17.4176 16.1022 17.4445 16.2028 17.4957 16.2915C17.5469 16.3802 17.6205 16.4538 17.7092 16.505L19.2247 17.38C19.2911 17.4189 19.3645 17.4443 19.4407 17.4547C19.5169 17.4652 19.5945 17.4604 19.6688 17.4407C19.7432 17.4211 19.813 17.3869 19.8741 17.3402C19.9352 17.2934 19.9864 17.2351 20.0249 17.1684C20.0634 17.1018 20.0883 17.0282 20.0982 16.952C20.1081 16.8757 20.1028 16.7982 20.0827 16.7239C20.0625 16.6497 20.0279 16.5802 19.9808 16.5194C19.9336 16.4586 19.8749 16.4077 19.8081 16.3697ZM18.0015 10C16.8478 10 15.6603 10.359 14.7011 11C13.7418 11.641 12.9415 12.4341 12.5 13.5C12.0585 14.5659 11.8852 16.0369 12.1103 17.1684C12.3353 18.3 12.8736 19.4942 13.6894 20.31C14.5053 21.1258 15.8684 21.7749 17 22C18.1316 22.2251 19.4341 21.9415 20.5 21.5C21.5659 21.0585 22.359 20.2573 23 19.298C23.641 18.3387 24.0015 17.1537 24.0015 16C23.9998 14.4534 23.5951 13.0936 22.5015 12C21.4079 10.9064 19.5481 10.0017 18.0015 10ZM18.0009 20.6665C17.0779 20.6665 16.1757 20.3928 15.4082 19.88C14.6408 19.3672 14.0427 18.6384 13.6894 17.7857C13.3362 16.933 13.2438 15.9947 13.4239 15.0894C13.604 14.1842 14.0484 13.3527 14.7011 12.7C15.3537 12.0474 16.1852 11.6029 17.0905 11.4228C17.9957 11.2428 18.934 11.3352 19.7867 11.6884C20.6395 12.0416 21.3683 12.6397 21.8811 13.4072C22.3939 14.1746 22.6676 15.0769 22.6676 15.9998C22.666 17.237 22.1738 18.4231 21.299 19.298C20.4242 20.1728 19.2381 20.665 18.0009 20.6665Z"/></svg>`,
  settings: `<svg width="24" height="24" viewBox="0 -960 960 960"><path d="M555-80H405q-15 0-26-10t-13-25l-12-93q-13-5-24.5-12T307-235l-87 36q-14 5-28 1t-22-17L96-344q-8-13-5-28t15-24l75-57q-1-7-1-13.5v-27q0-6.5 1-13.5l-75-57q-12-9-15-24t5-28l74-129q7-14 21.5-17.5T220-761l87 36q11-8 23-15t24-12l12-93q2-15 13-25t26-10h150q15 0 26 10t13 25l12 93q13 5 24.5 12t22.5 15l87-36q14-5 28-1t22 17l74 129q8 13 5 28t-15 24l-75 57q1 7 1 13.5v27q0 6.5-2 13.5l75 57q12 9 15 24t-5 28l-74 128q-8 13-22.5 17.5T738-199l-85-36q-11 8-23 15t-24 12l-12 93q-2 15-13 25t-26 10Zm-73-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm0-80q-25 0-42.5-17.5T422-480q0-25 17.5-42.5T482-540q25 0 42.5 17.5T542-480q0 25-17.5 42.5T482-420Zm-2-60Zm-40 320h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Z"/></svg>`,
  chevron: `<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9 3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z"/></svg>`,
};

function log(...args) {
  console.log("[VOT]", ...args);
}

let audioEl = null;
let currentVideoId = null;
let translating = false;
let videoListeners = [];
let btnBar = null;
let voiceMenuEl = null;
let settingsMenuEl = null;
let subOverlay = null;
let wordTip = null;
let settings = { ...DEFAULTS };
let autoStartedFor = null;
let cueEn = [];
let cueRu = [];
let subRaf = 0;
let subTimer = 0;
let lastEnText = "";
let lastRuText = "";
const wordCache = new Map();
let subsLoadedFor = null;

async function loadSettings() {
  try {
    settings = { ...DEFAULTS, ...(await STORE.get(DEFAULTS)) };
  } catch {
    settings = { ...DEFAULTS };
  }
  return settings;
}

async function saveSetting(key, value) {
  settings[key] = value;
  await STORE.set({ [key]: value });
  applyBarLayout();
  syncSettingsPanel();
  if (key === "subtitles" && currentVideoId) ensureSubtitles(currentVideoId);
}

function injectStyles() {
  if (document.getElementById("vot-helium-styles")) return;
  const style = document.createElement("style");
  style.id = "vot-helium-styles";
  style.textContent = `
    .vot-btn-bar {
      position: absolute !important; top: 60px !important; z-index: 2147483646 !important;
      display: flex !important; align-items: center !important; height: 38px !important;
      background: rgba(20,22,21,0.96) !important; color: #f2efe6 !important; fill: #f2efe6 !important;
      border: 1px solid rgba(242,239,230,0.12) !important; border-radius: 10px !important;
      box-shadow: 0 8px 28px rgba(0,0,0,0.45) !important;
      font-family: ui-sans-serif, system-ui, sans-serif !important; font-size: 13px !important;
      user-select: none !important; opacity: 0; transition: opacity 0.2s ease;
    }
    .vot-btn-bar.pos-default { left: 50% !important; transform: translateX(-50%) !important; }
    .vot-btn-bar.pos-left { left: 12px !important; transform: none !important; }
    .vot-btn-bar.pos-right { right: 12px !important; left: auto !important; transform: none !important; }
    .vot-btn-bar.visible { opacity: 1; }
    .vot-btn-bar svg { width: 22px; height: 22px; display: block; fill: inherit; }
    .vot-btn-bar .vot-sep { width: 1px; height: 20px; background: rgba(242,239,230,0.12); flex-shrink: 0; }
    .vot-btn-bar .vot-segment {
      display: flex; align-items: center; justify-content: center; height: 100%; padding: 0 10px;
      cursor: pointer; background: transparent; border: none; color: inherit; fill: inherit; outline: none;
    }
    .vot-btn-bar .vot-segment:hover { background: rgba(255,255,255,0.07); }
    .vot-btn-bar .vot-segment-label { margin-left: 6px; white-space: nowrap; font-weight: 600; font-size: 13px; }
    .vot-btn-bar .vot-segment-icon { min-width: 38px; padding: 0; }
    .vot-btn-bar .vot-voice-wrap, .vot-btn-bar .vot-settings-wrap { position: relative; height: 100%; display: flex; }
    .vot-btn-bar .vot-voice-btn {
      display: flex; align-items: center; gap: 4px; height: 100%; padding: 0 8px;
      background: transparent; border: none; color: inherit; fill: inherit; cursor: pointer; font: inherit; font-size: 12px;
    }
    .vot-btn-bar .vot-voice-btn:hover { background: rgba(255,255,255,0.07); }
    .vot-btn-bar .vot-voice-btn svg { width: 18px; height: 18px; transition: transform 0.15s; }
    .vot-btn-bar .vot-voice-btn.open svg { transform: rotate(180deg); }
    .vot-btn-bar .vot-vol { display: flex; align-items: center; height: 100%; padding: 0 10px; }
    .vot-btn-bar .vot-vol input[type="range"] { width: 72px; accent-color: #e0b13a; cursor: pointer; }
    .vot-btn-bar[data-status="success"] .vot-translate { color: #e0b13a; fill: #e0b13a; }
    .vot-btn-bar[data-status="error"] .vot-translate { color: #e07070; fill: #e07070; }
    .vot-btn-bar[data-loading="true"] #vot-loading-icon { display: block !important; }
    .vot-btn-bar[data-loading="true"] #vot-translate-icon { display: none !important; }
    .vot-btn-bar[data-loading="true"] .vot-translate { opacity: 0.7; cursor: default; }

    /* Menus live on document.body — escape YouTube transform/overflow */
    .vot-menu {
      display: none; position: fixed !important; z-index: 2147483647 !important;
      min-width: 280px; max-width: min(360px, calc(100vw - 16px));
      max-height: min(70vh, 440px); overflow-y: auto; overflow-x: hidden;
      background: #141615 !important; border: 1px solid rgba(242,239,230,0.14) !important;
      border-radius: 12px !important; box-shadow: 0 16px 40px rgba(0,0,0,0.55) !important;
      padding: 10px !important; color: #f2efe6 !important;
      font-family: ui-sans-serif, system-ui, sans-serif !important; font-size: 12px !important;
      box-sizing: border-box !important;
    }
    .vot-menu.open { display: block !important; }
    .vot-menu .vot-voice-item {
      display: block; width: 100%; text-align: left; padding: 9px 10px; background: transparent;
      border: none; color: inherit; border-radius: 8px; cursor: pointer; font: inherit; font-size: 12px; line-height: 1.35;
    }
    .vot-menu .vot-voice-item:hover { background: rgba(255,255,255,0.07); }
    .vot-menu .vot-voice-item.active { color: #e0b13a; }
    .vot-menu .vot-voice-item small, .vot-menu .vot-settings-row small {
      display: block; color: #9a9588; font-size: 11px; margin-top: 2px; font-weight: 400;
    }
    .vot-menu .vot-settings-row {
      display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 12px;
      padding: 9px 10px; border-radius: 8px; box-sizing: border-box;
    }
    .vot-menu .vot-settings-row + .vot-settings-row { margin-top: 2px; }
    .vot-menu .vot-settings-row select {
      background: #222622; color: #f2efe6; border: 1px solid rgba(242,239,230,0.12);
      border-radius: 6px; padding: 5px 8px; font: inherit; font-size: 12px; max-width: 120px;
    }
    .vot-menu .vot-toggle {
      width: 36px; height: 20px; border-radius: 999px; border: none; padding: 2px;
      background: #333; cursor: pointer; flex-shrink: 0;
    }
    .vot-menu .vot-toggle.on { background: #c49212; }
    .vot-menu .vot-toggle i {
      display: block; width: 16px; height: 16px; border-radius: 50%; background: #fff;
      transition: transform 0.15s ease;
    }
    .vot-menu .vot-toggle.on i { transform: translateX(16px); }

    .vot-subs {
      position: fixed !important; z-index: 2147483645 !important;
      text-align: center; padding: 0 12px; box-sizing: border-box;
      font-family: ui-sans-serif, system-ui, sans-serif;
      pointer-events: none;
    }
    .vot-subs .vot-sub-line {
      display: none; max-width: 100%; margin: 3px auto; padding: 6px 12px;
      background: rgba(0,0,0,0.72); border-radius: 8px; color: #fff;
      font-size: clamp(15px, 2.2vw, 20px); line-height: 1.4; font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.9); pointer-events: auto; cursor: default;
    }
    .vot-subs .vot-sub-en { color: #f2efe6; }
    .vot-subs .vot-sub-ru { color: #e0b13a; font-weight: 500; }
    .vot-subs .vot-word {
      display: inline; cursor: pointer; border-bottom: 1px dotted rgba(255,255,255,0.35);
      padding: 0 1px;
    }
    .vot-subs .vot-word:hover { background: rgba(224,177,58,0.35); border-radius: 3px; }
    .vot-word-tip {
      display: none; position: fixed; z-index: 2147483647; max-width: 280px;
      background: #141615; color: #f2efe6; border: 1px solid rgba(242,239,230,0.14);
      border-radius: 10px; padding: 10px 12px; box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; line-height: 1.4;
      pointer-events: none;
    }
    .vot-word-tip.open { display: block; }
    .vot-word-tip .vot-tip-word { color: #9a9588; font-size: 11px; margin-bottom: 4px; }
    .vot-word-tip .vot-tip-tr { font-weight: 600; font-size: 15px; color: #e0b13a; }
  `;
  document.head.appendChild(style);
}

function voiceLabel(mode) {
  return mode === "live" ? "Live" : "Fast";
}

function applyBarLayout() {
  if (!btnBar) return;
  btnBar.classList.remove("pos-default", "pos-left", "pos-right");
  const pos = settings.buttonPosition === "left" || settings.buttonPosition === "right"
    ? settings.buttonPosition
    : "default";
  btnBar.classList.add(`pos-${pos}`);
  const volWrap = btnBar.querySelector(".vot-vol");
  if (volWrap) volWrap.style.display = settings.showVolume ? "flex" : "none";
  const voiceBtn = btnBar.querySelector(".vot-voice-current");
  if (voiceBtn) voiceBtn.textContent = voiceLabel(settings.voiceMode);
  voiceMenuEl?.querySelectorAll(".vot-voice-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.mode === settings.voiceMode);
  });
  const range = btnBar.querySelector(".vot-vol input");
  if (range) range.value = String(settings.translationVolume ?? 100);
  if (audioEl) audioEl.volume = Math.min(1, Math.max(0, (settings.translationVolume ?? 100) / 100));
}

function syncSettingsPanel() {
  const root = settingsMenuEl;
  if (!root) return;
  root.querySelector('[data-setting="autoTranslate"]')?.classList.toggle("on", !!settings.autoTranslate);
  root.querySelector('[data-setting="showVolume"]')?.classList.toggle("on", !!settings.showVolume);
  const map = ["voiceMode", "buttonPosition", "sourceLang", "targetLang", "subtitles"];
  for (const key of map) {
    const el = root.querySelector(`select[data-setting="${key}"]`);
    if (el) el.value = settings[key];
  }
}

function createButtonBar() {
  const bar = document.createElement("div");
  bar.className = "vot-btn-bar pos-default";
  bar.dataset.status = "idle";

  const transSeg = document.createElement("button");
  transSeg.type = "button";
  transSeg.className = "vot-segment vot-translate";
  transSeg.innerHTML = `${ICONS.translate}<span class="vot-segment-label">Translate</span>`;

  const voiceWrap = document.createElement("div");
  voiceWrap.className = "vot-voice-wrap";
  voiceWrap.innerHTML = `
    <button type="button" class="vot-voice-btn" aria-label="Voice style">
      <span class="vot-voice-current">${voiceLabel(settings.voiceMode)}</span>
      ${ICONS.chevron}
    </button>
  `;

  voiceMenuEl = document.createElement("div");
  voiceMenuEl.className = "vot-menu vot-voice-menu";
  voiceMenuEl.innerHTML = `
    <button type="button" class="vot-voice-item" data-mode="live">Live<small>Better voice quality</small></button>
    <button type="button" class="vot-voice-item" data-mode="fast">Fast<small>Simpler, quicker TTS</small></button>
  `;

  const sep1 = document.createElement("div");
  sep1.className = "vot-sep";
  const vol = document.createElement("div");
  vol.className = "vot-vol";
  vol.innerHTML = `<input type="range" min="0" max="100" step="1" aria-label="Translation volume">`;
  const sep2 = document.createElement("div");
  sep2.className = "vot-sep";

  const settingsWrap = document.createElement("div");
  settingsWrap.className = "vot-settings-wrap";
  settingsWrap.innerHTML = `
    <button type="button" class="vot-segment vot-segment-icon vot-settings-btn" aria-label="Settings">
      ${ICONS.settings}
    </button>
  `;

  settingsMenuEl = document.createElement("div");
  settingsMenuEl.className = "vot-menu vot-settings-menu";
  settingsMenuEl.innerHTML = `
    <div class="vot-settings-row">
      <div>Auto-translate English<small>Start when a video opens</small></div>
      <button type="button" class="vot-toggle" data-setting="autoTranslate"><i></i></button>
    </div>
    <div class="vot-settings-row">
      <div>Subtitles<small>English + Russian on screen</small></div>
      <select data-setting="subtitles">
        <option value="dual">EN + RU</option>
        <option value="en">English</option>
        <option value="ru">Russian</option>
        <option value="off">Off</option>
      </select>
    </div>
    <div class="vot-settings-row">
      <div>Voice style</div>
      <select data-setting="voiceMode">
        <option value="live">Live</option>
        <option value="fast">Fast</option>
      </select>
    </div>
    <div class="vot-settings-row">
      <div>Source</div>
      <select data-setting="sourceLang">
        <option value="en">English</option>
        <option value="de">German</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh">Chinese</option>
      </select>
    </div>
    <div class="vot-settings-row">
      <div>Target</div>
      <select data-setting="targetLang">
        <option value="ru">Russian</option>
        <option value="en">English</option>
        <option value="kk">Kazakh</option>
        <option value="de">German</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="ja">Japanese</option>
      </select>
    </div>
    <div class="vot-settings-row">
      <div>Position</div>
      <select data-setting="buttonPosition">
        <option value="default">Center</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </div>
    <div class="vot-settings-row">
      <div>Volume slider<small>Show on the bar</small></div>
      <button type="button" class="vot-toggle" data-setting="showVolume"><i></i></button>
    </div>
  `;

  bar.append(transSeg, voiceWrap, sep1, vol, sep2, settingsWrap);
  document.body.append(voiceMenuEl, settingsMenuEl);
  return bar;
}

function closeMenus() {
  voiceMenuEl?.classList.remove("open");
  settingsMenuEl?.classList.remove("open");
  btnBar?.querySelector(".vot-voice-btn")?.classList.remove("open");
}

function placeMenu(menu, anchor, { preferLeft = false } = {}) {
  if (!menu) return;
  if (menu.parentElement !== document.body) document.body.appendChild(menu);
  const r = anchor.getBoundingClientRect();
  const pad = 8;
  menu.style.visibility = "hidden";
  menu.classList.add("open");
  const mw = menu.offsetWidth || 280;
  const mh = menu.offsetHeight || 200;
  let left = preferLeft ? r.left : r.right - mw;
  left = Math.min(Math.max(pad, left), window.innerWidth - mw - pad);
  let top = r.bottom + pad;
  if (top + mh > window.innerHeight - pad) top = Math.max(pad, r.top - pad - mh);
  top = Math.min(Math.max(pad, top), window.innerHeight - mh - pad);
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;
  menu.style.visibility = "visible";
}

// ───── Subtitles (YouTube timedtext EN + auto-translate RU) ─────
function pageRequest(type, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const id = Math.random().toString(36).slice(2);
    const onMsg = (event) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== "vot-helium" || data.dir !== "res" || data.id !== id) return;
      window.removeEventListener("message", onMsg);
      resolve(data.payload || null);
    };
    window.addEventListener("message", onMsg);
    window.postMessage({ source: "vot-helium", dir: "req", id, type }, "*");
    setTimeout(() => {
      window.removeEventListener("message", onMsg);
      resolve(null);
    }, timeoutMs);
  });
}

function extractJsonObject(text, marker) {
  const i = text.indexOf(marker);
  if (i < 0) return null;
  const start = text.indexOf("{", i);
  if (start < 0) return null;
  let depth = 0;
  for (let p = start; p < text.length; p++) {
    const ch = text[p];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, p + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function absUrl(u) {
  if (!u) return null;
  if (u.startsWith("//")) return `https:${u}`;
  return u;
}

function tracksFromPlayerResponse(pr) {
  return pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
}

function pickCaptionTrack(tracks, preferLang) {
  if (!tracks?.length) return null;
  const lang = preferLang || "en";
  return (
    tracks.find((t) => t.languageCode === lang && t.kind !== "asr") ||
    tracks.find((t) => t.languageCode === lang) ||
    tracks.find((t) => (t.languageCode || "").startsWith(lang)) ||
    tracks.find((t) => t.kind === "asr") ||
    tracks[0]
  );
}

function getPlayerResponseFromDom() {
  for (const script of document.scripts) {
    const t = script.textContent || "";
    if (!t.includes("ytInitialPlayerResponse")) continue;
    const pr = extractJsonObject(t, "ytInitialPlayerResponse");
    if (pr?.videoDetails || pr?.captions) return pr;
  }
  return null;
}

async function listTimedTextTracks(videoId) {
  try {
    const xml = await fetch(
      `https://www.youtube.com/api/timedtext?type=list&v=${encodeURIComponent(videoId)}`,
      { credentials: "include" },
    ).then((r) => r.text());
    if (!xml || xml.startsWith("<html")) return [];
    const docs = new DOMParser().parseFromString(xml, "text/xml");
    return [...docs.querySelectorAll("track")].map((t) => ({
      languageCode: t.getAttribute("lang_code") || "",
      kind: t.getAttribute("kind") || "",
      name: t.getAttribute("name") || "",
      baseUrl: `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=${encodeURIComponent(t.getAttribute("lang_code") || "en")}${t.getAttribute("name") ? `&name=${encodeURIComponent(t.getAttribute("name"))}` : ""}&fmt=json3`,
    }));
  } catch (e) {
    log("timedtext list failed", e);
    return [];
  }
}

async function getCaptionBaseUrl(videoId) {
  // 1) live player API (works after SPA navigations)
  let pr = await pageRequest("playerResponse");
  let tracks = tracksFromPlayerResponse(pr);

  // 2) script tags on the page
  if (!tracks.length) {
    pr = getPlayerResponseFromDom();
    tracks = tracksFromPlayerResponse(pr);
  }

  // 3) re-fetch watch HTML
  if (!tracks.length) {
    try {
      const html = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        credentials: "include",
      }).then((r) => r.text());
      pr = extractJsonObject(html, "ytInitialPlayerResponse");
      tracks = tracksFromPlayerResponse(pr);
    } catch (e) {
      log("watch fetch failed", e);
    }
  }

  // 4) timedtext track list
  if (!tracks.length) tracks = await listTimedTextTracks(videoId);

  log("Caption tracks", tracks.map((t) => `${t.languageCode}${t.kind ? "/" + t.kind : ""}`).join(", ") || "(none)");
  const track = pickCaptionTrack(tracks, settings.sourceLang || "en");
  return absUrl(track?.baseUrl) || null;
}

function parseJson3(data) {
  const events = data?.events || [];
  const cues = [];
  let buf = "";
  let bufStart = 0;
  let bufEnd = 0;

  const flush = () => {
    const text = buf.replace(/\s+/g, " ").trim();
    if (text) {
      cues.push({
        start: bufStart / 1000,
        end: Math.max(bufEnd, bufStart + 1200) / 1000,
        text,
      });
    }
    buf = "";
  };

  for (const ev of events) {
    if (ev.tStartMs == null || !ev.segs) continue;
    const piece = ev.segs.map((s) => s.utf8 || "").join("");
    if (!piece) continue;
    if (piece === "\n") {
      flush();
      continue;
    }
    if (!buf) bufStart = ev.tStartMs;
    buf += piece;
    bufEnd = ev.tStartMs + (ev.dDurationMs || 1800);
    if (/[.!?…]$/.test(piece.trim()) || buf.length > 80 || (ev.dDurationMs || 0) > 2800) flush();
  }
  flush();

  // If buffering produced nothing, fall back to per-event cues
  if (!cues.length) {
    for (const ev of events) {
      if (ev.tStartMs == null || !ev.segs) continue;
      const text = ev.segs.map((s) => s.utf8 || "").join("").replace(/\s+/g, " ").trim();
      if (!text) continue;
      cues.push({
        start: ev.tStartMs / 1000,
        end: (ev.tStartMs + (ev.dDurationMs || 2000)) / 1000,
        text,
      });
    }
  }
  return cues;
}

async function loadTimedtext(baseUrl, tlang) {
  const u = new URL(baseUrl, location.origin);
  u.searchParams.set("fmt", "json3");
  if (tlang) u.searchParams.set("tlang", tlang);
  else u.searchParams.delete("tlang");

  const res = await fetch(u.toString(), { credentials: "include" });
  if (!res.ok) throw new Error(`timedtext HTTP ${res.status}`);
  const text = await res.text();
  if (!text || text.startsWith("<")) throw new Error("timedtext not json");
  const data = JSON.parse(text);
  const cues = parseJson3(data);
  if (!cues.length) throw new Error("timedtext empty cues");
  return cues;
}

function activeCue(cues, t) {
  for (let i = 0; i < cues.length; i++) {
    if (t >= cues[i].start && t < cues[i].end) return cues[i].text;
  }
  // slight grace
  for (let i = cues.length - 1; i >= 0; i--) {
    if (t >= cues[i].start && t <= cues[i].end + 0.35) return cues[i].text;
  }
  return "";
}

function ensureWordTip() {
  if (wordTip) return wordTip;
  wordTip = document.createElement("div");
  wordTip.className = "vot-word-tip";
  wordTip.innerHTML = `<div class="vot-tip-word"></div><div class="vot-tip-tr"></div>`;
  document.body.appendChild(wordTip);
  return wordTip;
}

async function translateWord(word) {
  const clean = word.replace(/^[^a-zA-ZÀ-ÿА-яёЁ]+|[^a-zA-ZÀ-ÿА-яёЁ']+$/g, "");
  if (!clean || clean.length < 2) return null;
  const from = settings.sourceLang || "en";
  const to = settings.targetLang || "ru";
  if (from === to) return clean;
  const key = `${from}:${to}:${clean.toLowerCase()}`;
  if (wordCache.has(key)) return wordCache.get(key);

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(clean)}`;
  const data = await fetch(url).then((r) => r.json());
  const tr = (data?.[0] || []).map((x) => x[0]).join("") || null;
  if (tr) wordCache.set(key, tr);
  return tr;
}

function fillLineWithWords(el, text, interactive) {
  el.textContent = "";
  if (!text) return;
  if (!interactive) {
    el.textContent = text;
    return;
  }
  const parts = text.split(/(\s+)/);
  for (const part of parts) {
    if (/^\s+$/.test(part) || !part) {
      el.appendChild(document.createTextNode(part));
      continue;
    }
    const span = document.createElement("span");
    span.className = "vot-word";
    span.textContent = part;
    span.addEventListener("mouseenter", async (e) => {
      const tip = ensureWordTip();
      tip.querySelector(".vot-tip-word").textContent = part;
      tip.querySelector(".vot-tip-tr").textContent = "…";
      tip.classList.add("open");
      const r = e.target.getBoundingClientRect();
      tip.style.left = `${Math.min(window.innerWidth - 300, Math.max(8, r.left))}px`;
      tip.style.top = `${Math.max(8, r.top - 64)}px`;
      try {
        const tr = await translateWord(part);
        if (tip.querySelector(".vot-tip-word").textContent === part) {
          tip.querySelector(".vot-tip-tr").textContent = tr || "—";
        }
      } catch {
        tip.querySelector(".vot-tip-tr").textContent = "—";
      }
    });
    span.addEventListener("mouseleave", () => {
      wordTip?.classList.remove("open");
    });
    el.appendChild(span);
  }
}

function ensureSubOverlay() {
  if (subOverlay) return subOverlay;
  subOverlay = document.createElement("div");
  subOverlay.className = "vot-subs";
  subOverlay.innerHTML = `<div class="vot-sub-line vot-sub-en"></div><div class="vot-sub-line vot-sub-ru"></div>`;
  document.body.appendChild(subOverlay);
  return subOverlay;
}

function positionSubs() {
  if (!subOverlay) return;
  const video = document.querySelector("#movie_player video, .html5-video-player video, video");
  if (!video) return;
  const r = video.getBoundingClientRect();
  if (r.width < 40 || r.height < 40) return;
  subOverlay.style.left = `${Math.round(r.left)}px`;
  subOverlay.style.width = `${Math.round(r.width)}px`;
  // sit above YouTube controls
  subOverlay.style.top = `${Math.round(r.top + r.height * 0.72)}px`;
}

function tickSubs() {
  subRaf = 0;
  const video = document.querySelector("#movie_player video, .html5-video-player video, video");
  if (!video || !subOverlay || settings.subtitles === "off") {
    if (subOverlay) subOverlay.style.display = "none";
    wordTip?.classList.remove("open");
    return;
  }
  if (!cueEn.length && !cueRu.length) {
    subOverlay.style.display = "none";
    return;
  }
  subOverlay.style.display = "block";
  positionSubs();
  const t = video.currentTime;
  const enEl = subOverlay.querySelector(".vot-sub-en");
  const ruEl = subOverlay.querySelector(".vot-sub-ru");
  const en = activeCue(cueEn, t);
  const ru = activeCue(cueRu, t);
  const mode = settings.subtitles;
  if (enEl) {
    const show = !!(en && mode !== "ru");
    enEl.style.display = show ? "inline-block" : "none";
    if (show && en !== lastEnText) {
      lastEnText = en;
      fillLineWithWords(enEl, en, true);
    }
  }
  if (ruEl) {
    const show = !!(ru && mode !== "en");
    ruEl.style.display = show ? "inline-block" : "none";
    if (show && ru !== lastRuText) {
      lastRuText = ru;
      fillLineWithWords(ruEl, ru, false);
    }
  }
}

function bindSubClock() {
  const video = document.querySelector("#movie_player video, .html5-video-player video, video");
  if (!video) return;
  if (!video.dataset.votSubsBound) {
    video.dataset.votSubsBound = "1";
    const schedule = () => {
      if (!subRaf) subRaf = requestAnimationFrame(tickSubs);
    };
    video.addEventListener("timeupdate", schedule);
    video.addEventListener("seeked", schedule);
    video.addEventListener("play", schedule);
    window.addEventListener("resize", positionSubs);
  }
  if (!subTimer) subTimer = setInterval(() => tickSubs(), 250);
}

async function ensureSubtitles(videoId, attempt = 0) {
  if (settings.subtitles === "off") {
    if (subOverlay) subOverlay.style.display = "none";
    wordTip?.classList.remove("open");
    return;
  }
  if (subsLoadedFor === videoId && (cueEn.length || cueRu.length)) {
    ensureSubOverlay();
    bindSubClock();
    tickSubs();
    return;
  }
  try {
    const base = await getCaptionBaseUrl(videoId);
    if (!base) {
      log("No caption tracks yet", attempt);
      // player response often arrives a bit after navigation
      if (attempt < 5) {
        setTimeout(() => ensureSubtitles(videoId, attempt + 1), 800 + attempt * 400);
      }
      return;
    }
    log("Caption base", base.slice(0, 120));
    const needEn = settings.subtitles === "dual" || settings.subtitles === "en";
    const needRu = settings.subtitles === "dual" || settings.subtitles === "ru";
    const [en, ru] = await Promise.all([
      needEn ? loadTimedtext(base).catch((e) => { log("EN subs fail", e); return []; }) : [],
      needRu ? loadTimedtext(base, settings.targetLang || "ru").catch((e) => { log("RU subs fail", e); return []; }) : [],
    ]);
    cueEn = en;
    cueRu = ru;
    lastEnText = "";
    lastRuText = "";
    if (cueEn.length || cueRu.length) subsLoadedFor = videoId;
    ensureSubOverlay();
    bindSubClock();
    tickSubs();
    log("Subtitles loaded", cueEn.length, cueRu.length);
    if (!cueEn.length && !cueRu.length && attempt < 5) {
      setTimeout(() => ensureSubtitles(videoId, attempt + 1), 1000);
    }
  } catch (e) {
    log("Subtitles failed", e);
    if (attempt < 5) setTimeout(() => ensureSubtitles(videoId, attempt + 1), 1000);
  }
}

// ───── Translation ─────
async function fetchTranslation(videoId) {
  const from = settings.sourceLang || "en";
  const to = settings.targetLang || "ru";
  const useLivelyVoice = settings.voiceMode !== "fast";
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const video = document.querySelector("video");
  const videoData = {
    url: videoUrl,
    videoId,
    host: "youtube",
    duration: Math.max(1, Math.floor(Number.isFinite(video?.duration) ? video.duration : 300)),
  };

  const errors = [];
  for (const host of WORKERS) {
    const client = new VOTWorkerClient({ host });
    try {
      for (let i = 0; i < 12; i++) {
        if (i > 0) setState("loading", `Waiting ${i}/11...`);
        const result = await client.translateVideo({
          videoData,
          requestLang: from,
          responseLang: to,
          extraOpts: { useLivelyVoice },
        });
        if (result?.translated && result.url) return result;
        const waitMs = Math.min(15000, Math.max(3000, (result?.remainingTime || 5) * 1000));
        await new Promise((r) => setTimeout(r, waitMs));
      }
      errors.push(`${host}: timeout`);
    } catch (e) {
      const msg = e?.message || String(e);
      if (useLivelyVoice && /auth|SESSION_REQUIRED|session/i.test(msg)) {
        errors.push(`${host}: live needs auth, fallback`);
        continue;
      }
      errors.push(`${host}: ${msg}`);
    }
  }

  if (useLivelyVoice) {
    const prev = settings.voiceMode;
    settings.voiceMode = "fast";
    try {
      return await fetchTranslation(videoId);
    } finally {
      settings.voiceMode = prev;
    }
  }
  throw new Error(errors.join("; ") || "translation failed");
}

function syncAudio(video, url) {
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl.remove();
    audioEl = null;
  }
  videoListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  videoListeners = [];

  audioEl = new Audio(url);
  // ponytail: no crossOrigin — nothing reads the samples, and CORS-mode media fails in Firefox
  audioEl.volume = Math.min(1, Math.max(0, (settings.translationVolume ?? 100) / 100));

  const onPlay = () => { if (audioEl?.paused) audioEl.play().catch(() => {}); };
  const onPause = () => audioEl?.pause();
  const onSeek = () => { if (audioEl) audioEl.currentTime = video.currentTime; };
  const onRate = () => { if (audioEl) audioEl.playbackRate = video.playbackRate; };

  video.addEventListener("play", onPlay);
  video.addEventListener("pause", onPause);
  video.addEventListener("seeked", onSeek);
  video.addEventListener("ratechange", onRate);
  videoListeners = [
    { el: video, type: "play", fn: onPlay },
    { el: video, type: "pause", fn: onPause },
    { el: video, type: "seeked", fn: onSeek },
    { el: video, type: "ratechange", fn: onRate },
  ];

  audioEl.currentTime = video.currentTime;
  if (!video.paused) audioEl.play().catch(() => {});
}

async function startTranslate(videoId) {
  if (translating) return;
  translating = true;
  setState("loading", settings.voiceMode === "live" ? "Live..." : "Translating...");
  try {
    const data = await fetchTranslation(videoId);
    const video = document.querySelector("video");
    if (!video) throw new Error("Video not found");
    syncAudio(video, data.url);
    setState("success", "Done");
    ensureSubtitles(videoId);
  } catch (e) {
    log("Error:", e);
    setState("error", "Error");
    setTimeout(() => {
      translating = false;
      setState("idle", "Translate");
    }, 4000);
    return;
  }
  translating = false;
}

function setState(status, label) {
  if (!btnBar) return;
  const lbl = btnBar.querySelector(".vot-segment-label");
  if (lbl && label != null) lbl.textContent = label;
  btnBar.dataset.status = status;
  btnBar.dataset.loading = status === "loading" ? "true" : "false";
}

function getVideoId() {
  return new URLSearchParams(window.location.search).get("v");
}

function getPlayerContainer() {
  return document.querySelector("#movie_player, .html5-video-player");
}

function maybeAutoTranslate(videoId) {
  if (!settings.autoTranslate || settings.sourceLang !== "en") return;
  if (autoStartedFor === videoId || translating) return;
  autoStartedFor = videoId;
  setTimeout(() => {
    if (currentVideoId === videoId && !translating) startTranslate(videoId);
  }, 900);
}

function injectBar(videoId) {
  if (btnBar || !getPlayerContainer()) return;
  const player = getPlayerContainer();
  btnBar = createButtonBar();
  player.appendChild(btnBar);
  applyBarLayout();
  syncSettingsPanel();
  requestAnimationFrame(() => btnBar?.classList.add("visible"));

  btnBar.querySelector(".vot-translate").addEventListener("click", () => {
    if (!translating) startTranslate(videoId);
  });

  const voiceBtn = btnBar.querySelector(".vot-voice-btn");
  voiceBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    settingsMenuEl?.classList.remove("open");
    if (voiceMenuEl.classList.contains("open")) {
      closeMenus();
      return;
    }
    placeMenu(voiceMenuEl, voiceBtn, { preferLeft: true });
    voiceBtn.classList.add("open");
  });
  voiceMenuEl.querySelectorAll(".vot-voice-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      saveSetting("voiceMode", item.dataset.mode);
      closeMenus();
    });
  });

  const settingsBtn = btnBar.querySelector(".vot-settings-btn");
  settingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    voiceMenuEl.classList.remove("open");
    voiceBtn.classList.remove("open");
    if (settingsMenuEl.classList.contains("open")) {
      settingsMenuEl.classList.remove("open");
      return;
    }
    placeMenu(settingsMenuEl, settingsBtn);
  });
  settingsMenuEl.addEventListener("click", (e) => e.stopPropagation());
  voiceMenuEl.addEventListener("click", (e) => e.stopPropagation());

  settingsMenuEl.querySelectorAll(".vot-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      saveSetting(btn.dataset.setting, !settings[btn.dataset.setting]);
    });
  });
  settingsMenuEl.querySelectorAll("select[data-setting]").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      e.stopPropagation();
      saveSetting(sel.dataset.setting, sel.value);
    });
  });

  const range = btnBar.querySelector(".vot-vol input");
  range.addEventListener("input", async () => {
    const val = Number(range.value);
    settings.translationVolume = val;
    if (audioEl) audioEl.volume = val / 100;
    await STORE.set({ translationVolume: val });
  });

  document.addEventListener("click", onDocClick, true);
  maybeAutoTranslate(videoId);
  ensureSubtitles(videoId);
}

function onDocClick(e) {
  if (btnBar?.contains(e.target)) return;
  if (voiceMenuEl?.contains(e.target)) return;
  if (settingsMenuEl?.contains(e.target)) return;
  closeMenus();
}

function removeBar() {
  document.removeEventListener("click", onDocClick, true);
  closeMenus();
  voiceMenuEl?.remove();
  settingsMenuEl?.remove();
  voiceMenuEl = null;
  settingsMenuEl = null;
  subOverlay?.remove();
  subOverlay = null;
  wordTip?.remove();
  wordTip = null;
  if (subTimer) {
    clearInterval(subTimer);
    subTimer = 0;
  }
  cueEn = [];
  cueRu = [];
  lastEnText = "";
  lastRuText = "";
  subsLoadedFor = null;
  btnBar?.remove();
  btnBar = null;
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
    audioEl.remove();
    audioEl = null;
  }
  videoListeners.forEach(({ el, type, fn }) => el.removeEventListener(type, fn));
  videoListeners = [];
  const video = document.querySelector("video");
  if (video) delete video.dataset.votSubsBound;
  currentVideoId = null;
  translating = false;
}

async function init() {
  if (!window.location.pathname.includes("/watch")) {
    removeBar();
    return;
  }
  const vid = getVideoId();
  if (!vid || vid === currentVideoId) return;
  translating = false;
  autoStartedFor = null;
  removeBar();
  currentVideoId = vid;
  await loadSettings();

  const tryInject = () => {
    if (getPlayerContainer() && !btnBar) {
      injectBar(vid);
      return true;
    }
    return false;
  };
  if (tryInject()) return;

  const obs = new MutationObserver(() => {
    if (tryInject()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 15000);
}

STORE.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  let touched = false;
  for (const [k, { newValue }] of Object.entries(changes)) {
    if (k in DEFAULTS) {
      settings[k] = newValue;
      touched = true;
    }
  }
  if (touched) {
    applyBarLayout();
    syncSettingsPanel();
    if (changes.subtitles && currentVideoId) ensureSubtitles(currentVideoId);
  }
});

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    removeBar();
    setTimeout(init, 500);
  }
}).observe(document.documentElement, { subtree: true, childList: true });

injectStyles();
loadSettings().then(() => {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
});
log("Loaded");
