// Runs in YouTube page JS world (not isolated) — can read yt player APIs.
(() => {
  if (window.__votHeliumPage) return;
  window.__votHeliumPage = true;

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const data = event.data;
    if (!data || data.source !== "vot-helium" || data.dir !== "req") return;

    let payload = null;
    try {
      if (data.type === "playerResponse") {
        const player =
          document.getElementById("movie_player") ||
          document.querySelector(".html5-video-player");
        payload =
          player?.getPlayerResponse?.() ||
          window.ytInitialPlayerResponse ||
          null;
      }
    } catch (err) {
      payload = { __error: String(err) };
    }

    window.postMessage(
      { source: "vot-helium", dir: "res", id: data.id, payload },
      "*",
    );
  });
})();
