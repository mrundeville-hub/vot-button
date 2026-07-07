// Zen VOT - Voice Over Translation for Zen Browser
// Based on vot.js library
import { VOTWorkerClient } from "@vot.js/core";
const WORKER_URL = "https://vot-worker.toil.cc";
let audioElement = null;
function createTranslateButton() {
    const btn = document.createElement("button");
    btn.id = "zen-vot-btn";
    btn.innerHTML = "🌐 Перевести";
    btn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #ff0000;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    opacity: 0.9;
    transition: opacity 0.2s;
  `;
    btn.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
    btn.addEventListener("mouseleave", () => (btn.style.opacity = "0.9"));
    return btn;
}
function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("v");
}
function getVideoElement() {
    return document.querySelector("video");
}
async function translateVideo(videoId) {
    const btn = document.getElementById("zen-vot-btn");
    if (!btn)
        return;
    btn.innerHTML = "⏳ Загрузка...";
    btn.disabled = true;
    try {
        const client = new VOTWorkerClient({
            host: WORKER_URL,
        });
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        // @ts-ignore - метод translate существует в runtime
        const response = await client.translate({
            url: videoUrl,
            from: "en",
            to: "ru",
        });
        if (response && response.url) {
            if (audioElement) {
                audioElement.pause();
                audioElement.remove();
            }
            audioElement = new Audio(response.url);
            audioElement.volume = 1.0;
            const video = getVideoElement();
            if (video) {
                audioElement.currentTime = video.currentTime;
                video.addEventListener("play", () => audioElement?.play());
                video.addEventListener("pause", () => audioElement?.pause());
                video.addEventListener("seeked", () => {
                    if (audioElement)
                        audioElement.currentTime = video.currentTime;
                });
                if (!video.paused) {
                    await audioElement.play();
                }
            }
            btn.innerHTML = "✅ Переведено";
            btn.style.background = "#00aa00";
        }
        else {
            throw new Error("No translation URL in response");
        }
    }
    catch (error) {
        console.error("[Zen VOT] Translation error:", error);
        btn.innerHTML = "❌ Ошибка";
        btn.style.background = "#ff0000";
        setTimeout(() => {
            btn.innerHTML = "🌐 Перевести";
            btn.disabled = false;
        }, 3000);
    }
}
function init() {
    if (!window.location.pathname.includes("/watch"))
        return;
    const videoId = getVideoId();
    if (!videoId)
        return;
    const observer = new MutationObserver(() => {
        const player = document.querySelector("#movie_player") || document.querySelector(".html5-video-player");
        if (player && !document.getElementById("zen-vot-btn")) {
            const btn = createTranslateButton();
            player.appendChild(btn);
            btn.addEventListener("click", () => translateVideo(videoId));
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        const oldBtn = document.getElementById("zen-vot-btn");
        if (oldBtn)
            oldBtn.remove();
        if (audioElement) {
            audioElement.pause();
            audioElement = null;
        }
        init();
    }
}).observe(document, { subtree: true, childList: true });
//# sourceMappingURL=content.js.map