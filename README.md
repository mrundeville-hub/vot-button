# VOT Button — Voice Over Translation

Закадровый перевод YouTube-видео через Yandex VOT + двойные субтитры с переводом слова
по наведению. Одна сборка ставится и в Chromium, и в Firefox.

| Движок | Браузеры | Статус |
|---|---|---|
| Chromium | Chrome, Edge, Brave, Opera, Vivaldi, Helium, Arc | ✅ MV3 service worker |
| Gecko | Firefox 128+, Zen, LibreWolf, Waterfox | ✅ MV3 event page |
| WebKit | Safari | ⚠️ нужна конвертация через Xcode (`xcrun safari-web-extension-converter build/`) |

## Установка

```bash
npm install && ./build.sh     # → build/ и vot-button-v1.0.8.zip
```

**Chromium:** `chrome://extensions` → Developer mode → **Load unpacked** → папка `build/`

**Firefox / Zen:** `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on** → `build/manifest.json`
Временная установка живёт до перезапуска. Для постоянной — подписать ZIP на
[addons.mozilla.org](https://addons.mozilla.org) (ID расширения уже задан в манифесте).

## Использование

Кнопка **Translate** появляется поверх плеера. Клик → перевод (первый раз Яндекс может
ставить видео в очередь, расширение само ждёт до 12 попыток). Рядом — выбор голоса
(live / fast), громкость и шестерёнка с настройками. Субтитры EN+RU показываются под
видео, наведение на английское слово даёт перевод.

## Как это работает

```
content.js ──VOTWorkerClient──▶ vot-worker.eu.cc ──▶ api.browser.yandex.ru
     │                                                        │
     │◀────────────────── mp3 с озвучкой ─────────────────────┘
     ▼
  <audio> синхронизируется с <video> (play/pause/seek/rate)

page.js (world: MAIN) ──postMessage──▶ content.js   # достаёт ytPlayerResponse для субтитров
```

## Что делает сборку кросс-браузерной

- `background`: указаны **и** `service_worker` (Chromium), **и** `scripts` (Firefox/Safari) —
  каждый движок берёт своё, [так и рекомендует MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background).
- `const api = globalThis.browser ?? globalThis.chrome` — Firefox отдаёт промисы через
  `browser.*`, Chromium через `chrome.*`. Полифилл не нужен.
- `strict_min_version: 128` — с Firefox 128 работает `content_scripts.world: "MAIN"`,
  а с 127 host-разрешения выдаются сразу при установке.
- У `<audio>` нет `crossOrigin` — Яндекс не отдаёт CORS-заголовки на аудио, и в Firefox
  CORS-режим ломал бы воспроизведение.
- Субтитры берут `playerResponse` тремя путями (MAIN-world → `<script>` на странице →
  повторный fetch watch-страницы), поэтому работают даже если `world: MAIN` не поддержан.

## Разработка

```
src/
├── content.js      # основной код (бандлится esbuild → build/content.js)
├── page.js         # MAIN-world мост к API плеера YouTube
├── background.js   # дефолты настроек + клик по иконке
├── options.html/js # страница настроек
├── manifest.json
└── check.mjs       # живая проверка воркера и перевода
```

```bash
npm run build   # сборка
npm run check   # дёргает vot-worker.eu.cc и реальный перевод — должно вывести "vot check ok"
npm run lint    # web-ext lint: 0 errors обязателен
```

`web-ext lint` оставляет ожидаемые предупреждения: `BACKGROUND_SERVICE_WORKER_IGNORED`
(это и есть кросс-браузерный ключ) и `UNSAFE_VAR_ASSIGNMENT` на `innerHTML` со
статичными SVG-иконками.

## Проблемы

| Симптом | Причина |
|---|---|
| «Error» на кнопке | видео ещё не переведено — подожди пару минут |
| нет звука | проверь громкость в баре и микшере, нажми play |
| нет субтитров | у видео нет дорожек `timedtext` на исходном языке |
| кнопки нет | не страница `/watch?v=...`, или плеер ещё грузится |

## Лицензия

MIT. Права на Yandex VOT API принадлежат Яндексу.

Спасибо [vot.js](https://github.com/FOSWLY/vot.js), [vot-worker](https://github.com/FOSWLY/vot-worker),
[voice-over-translation](https://github.com/ilyhalight/voice-over-translation).
