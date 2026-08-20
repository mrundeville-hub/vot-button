// VOT Button — Yandex voice-over translation for YouTube (Zen & Helium)
// Production-ready version

import { fetchTranslation } from "./translation.js";

let audioElement = null;
let currentVideoId = null;
let isTranslating = false;

// Logger
function log(level, ...args) {
  const prefix = "[VOT Button]";
  if (level === "error") console.error(prefix, ...args);
  else if (level === "warn") console.warn(prefix, ...args);
  else console.log(prefix, ...args);
}

// Create translate button
function createTranslateButton() {
  const btn = document.createElement("button");
  btn.id = "vot-button-btn";
  btn.setAttribute("aria-label", "Перевести видео (Yandex VOT)");
  btn.tabIndex = 0;
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
    <span id="vot-button-text">Перевести</span>
  `;
  btn.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2147483647;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    opacity: 0.95;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(238, 90, 90, 0.3);
    display: flex;
    align-items: center;
  `;

  btn.addEventListener("mouseenter", () => {
    btn.style.opacity = "1";
    btn.style.transform = "scale(1.02)";
    btn.style.boxShadow = "0 4px 12px rgba(238, 90, 90, 0.4)";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.opacity = "0.95";
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 2px 8px rgba(238, 90, 90, 0.3)";
  });

  return btn;
}

// Get YouTube video ID
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

// Get video element
function getVideoElement() {
  return document.querySelector("video");
}

// Get player container
function getPlayerContainer() {
  return document.querySelector("#movie_player") ||
         document.querySelector(".html5-video-player") ||
         document.querySelector("ytd-watch-flexy #player-container");
}

// Update button state
function updateButtonState(state, message) {
  const btn = document.getElementById("vot-button-btn");
  const text = document.getElementById("vot-button-text");
  if (!btn || !text) return;

  const states = {
    idle: { bg: "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)", text: "Перевести" },
    loading: { bg: "linear-gradient(135deg, #f0ad4e 0%, #ec971f 100%)", text: "⏳ " + (message || "Загрузка...") },
    success: { bg: "linear-gradient(135deg, #5cb85c 0%, #4cae4c 100%)", text: "✅ " + (message || "Переведено") },
    error: { bg: "linear-gradient(135deg, #d9534f 0%, #c9302c 100%)", text: "❌ " + (message || "Ошибка") },
  };

  const s = states[state] || states.idle;
  btn.style.background = s.bg;
  text.textContent = s.text;
  btn.disabled = state === "loading";
}

// Main translation function
async function translateVideo(videoId) {
  if (isTranslating) return;
  isTranslating = true;

  updateButtonState("loading", "Загрузка...");

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const data = await fetchTranslation(videoUrl);

    if (!data || !data.url) {
      // Try alternative: maybe translation is pending
      if (data && data.pending) {
        updateButtonState("loading", "Ожидание...");
        // Poll for result
        await pollForTranslation(videoUrl);
        return;
      }
      throw new Error("No translation URL in response");
    }

    await playTranslation(data.url);
    updateButtonState("success", "Переведено");

  } catch (error) {
    log("error", "Translation failed:", error);
    updateButtonState("error", error.message.includes("pending") ? "В очереди" : "Ошибка");

    if (!error.message.includes("pending")) {
      setTimeout(() => {
        updateButtonState("idle");
        isTranslating = false;
      }, 4000);
    }
  }
}

// Poll for pending translation
async function pollForTranslation(videoUrl, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000));
    updateButtonState("loading", `Ожидание ${i + 1}/${maxAttempts}...`);

    try {
      const data = await fetchTranslation(videoUrl, 0);
      if (data && data.url) {
        await playTranslation(data.url);
        updateButtonState("success", "Переведено");
        return;
      }
    } catch (e) {
      log("warn", "Poll attempt failed:", e.message);
    }
  }

  updateButtonState("error", "Таймаут");
  setTimeout(() => {
    updateButtonState("idle");
    isTranslating = false;
  }, 4000);
}

// Play translation audio synced with video
async function playTranslation(audioUrl) {
  // Clean up old audio
  if (audioElement) {
    audioElement.pause();
    audioElement.src = "";
    audioElement.remove();
    audioElement = null;
  }

  // Create new audio element
  audioElement = new Audio(audioUrl);
  audioElement.volume = 1.0;
  audioElement.crossOrigin = "anonymous";

  const video = getVideoElement();
  if (!video) {
    throw new Error("Video element not found");
  }

  // Sync audio with video
  audioElement.currentTime = video.currentTime;

  // Event listeners for sync
  const onVideoPlay = () => {
    if (audioElement && audioElement.paused) {
      audioElement.play().catch(e => log("warn", "Audio play failed:", e));
    }
  };

  const onVideoPause = () => {
    if (audioElement) audioElement.pause();
  };

  const onVideoSeek = () => {
    if (audioElement) {
      audioElement.currentTime = video.currentTime;
    }
  };

  const onVideoRateChange = () => {
    if (audioElement) {
      audioElement.playbackRate = video.playbackRate;
    }
  };

  video.addEventListener("play", onVideoPlay);
  video.addEventListener("pause", onVideoPause);
  video.addEventListener("seeked", onVideoSeek);
  video.addEventListener("ratechange", onVideoRateChange);

  // Cleanup on audio end
  audioElement.addEventListener("ended", () => {
    video.removeEventListener("play", onVideoPlay);
    video.removeEventListener("pause", onVideoPause);
    video.removeEventListener("seeked", onVideoSeek);
    video.removeEventListener("ratechange", onVideoRateChange);
  });

  // Start playing if video is already playing
  if (!video.paused) {
    await audioElement.play();
  }
}

// Initialize extension
function init() {
  // Only run on watch pages
  if (!window.location.pathname.includes("/watch")) {
    cleanup();
    return;
  }

  const videoId = getVideoId();
  if (!videoId || videoId === currentVideoId) return;

  currentVideoId = videoId;
  isTranslating = false;

  log("info", "Initializing for video:", videoId);

  // Wait for player and inject button
  const observer = new MutationObserver(() => {
    const player = getPlayerContainer();
    if (player && !document.getElementById("vot-button-btn")) {
      const btn = createTranslateButton();
      player.appendChild(btn);

      btn.addEventListener("click", () => {
        if (!isTranslating) translateVideo(videoId);
      });

      log("info", "Button injected");
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Timeout cleanup
  setTimeout(() => observer.disconnect(), 10000);
}

// Cleanup function
function cleanup() {
  const btn = document.getElementById("vot-button-btn");
  if (btn) btn.remove();

  if (audioElement) {
    audioElement.pause();
    audioElement.src = "";
    audioElement.remove();
    audioElement = null;
  }

  currentVideoId = null;
  isTranslating = false;
}

// Handle SPA navigation (YouTube is single-page)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    log("info", "URL changed:", url);
    cleanup();
    // Small delay for YouTube to render new page
    setTimeout(init, 500);
  }
}).observe(document, { subtree: true, childList: true });

// Initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
