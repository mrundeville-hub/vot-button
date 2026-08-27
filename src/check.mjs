// ponytail: asserts live worker + translate path; upgrade = fixture protobuf decode
import { VOTWorkerClient } from "@vot.js/core";

const host = "vot-worker.eu.cc";
const health = await fetch(`https://${host}/health`).then((r) => r.json());
if (health.status !== "ok") throw new Error("health failed: " + JSON.stringify(health));

const client = new VOTWorkerClient({ host });
const result = await client.translateVideo({
  videoData: {
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    videoId: "jNQXAC9IVRw",
    host: "youtube",
    duration: 19,
  },
  requestLang: "en",
  responseLang: "ru",
});

if (!result.translated || !result.url?.startsWith("http")) {
  throw new Error("unexpected translate result: " + JSON.stringify(result));
}
console.log("vot check ok");
