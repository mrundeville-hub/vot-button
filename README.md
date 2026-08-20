# VOT Button — Voice Over Translation

Расширение, которое добавляет на YouTube кнопку закадрового перевода через Yandex VOT API.
Работает и в **Zen** / Firefox, и в **Helium** / Chrome / любом Chromium — весь код это один
content script на `fetch`, без `browser.*` и `chrome.*` API, поэтому одна сборка ставится в оба движка.

## ✨ Возможности

- 🎯 **Перевод видео** — нажми кнопку и получи закадровый перевод
- 🔄 **Авто-синхронизация** — аудио перевода синхронизируется с видео (play/pause/seek/speed)
- 🌐 **Fallback workers** — если один worker недоступен, пробует альтернативные
- ⏳ **Очередь перевода** — если перевод ещё не готов, ждёт автоматически
- 🎨 **Красивая кнопка** — современный дизайн с анимацией

## 📁 Структура проекта

```
vot-button/
├── build/                  # Готовая сборка
│   ├── manifest.json
│   ├── content.js         # Сборка скрипта (minified)
│   ├── icon.png           # 48x48
│   ├── icon@2x.png        # 96x96
│   └── icon@3x.png        # 128x128
├── src/
│   └── content.js         # Исходный код
├── dist/                  # Dev сборка
├── manifest.json          # Манифест расширения
├── icon.svg               # SVG иконка (source)
├── build.sh               # Скрипт сборки
└── README.md              # Этот файл
```

## 🚀 Быстрый старт

Сначала собери: `npm install && ./build.sh` — готовое расширение окажется в `build/`.

### Zen / Firefox

1. `about:debugging` → **This Firefox** → **Load Temporary Add-on**
2. Выбери `build/manifest.json`

Временная установка живёт до перезапуска браузера. Для постоянной нужна подпись:
залей `vot-button-v1.0.0.zip` на [addons.mozilla.org](https://addons.mozilla.org).

### Helium / Chrome / Chromium

1. `chrome://extensions` → включи **Developer mode**
2. **Load unpacked** → выбери папку `build/`

Chromium проигнорирует ключ `browser_specific_settings` в манифесте (он нужен только Firefox)
и может показать предупреждение «Unrecognized manifest key» — на работу это не влияет.

### Использование

1. Открой любое видео на YouTube
2. В правом верхнем углу плеера появится красная кнопка "🌐 Перевести"
3. Нажми — начнётся загрузка перевода
4. Кнопка станет жёлтой ("⏳ Загрузка...")
5. После готовности станет зелёной ("✅ Переведено")
6. Появится озвучка поверх оригинального видео

## 🛠️ Разработка

### Сборка

```bash
# Установить зависимости
npm install

# Сборка production
./build.sh

# Или вручную:
npx esbuild src/content.js --bundle --outfile=build/content.js --format=iife --platform=browser --minify
```

### Dev режим

```bash
# Без минификации для отладки
npx esbuild src/content.js --bundle --outfile=dist/content.bundle.js --format=iife --platform=browser --sourcemap
```

## 🔧 Как это работает

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ YouTube     │────▶│ vot-worker   │────▶│ Yandex VOT API  │
│  (браузер)  │     │ (proxy)      │     │ (api.browser...)│
└─────────────┘     └──────────────┘     └─────────────────┘
       │                                              │
       │◄─────────────────────────────────────────────┘
       │         Аудио файл перевода
       ▼
┌─────────────┐
│ <audio>     │  ← Синхронизирован с <video>
│ элемент     │    (play/pause/seek/rate)
└─────────────┘
```

### Архитектура

1. **Content Script** — внедряется на страницы YouTube
2. **MutationObserver** — ждёт появления видео-плеера
3. **Инъекция кнопки** — добавляет кнопку в DOM плеера
4. **Worker Proxy** — отправляет запрос на `vot-worker.toil.cc`
5. **Yandex API** — worker обращается к `api.browser.yandex.ru`
6. **Аудио элемент** — создаёт `<audio>` и синхронизирует с видео

## ⚠️ Возможные проблемы

### "❌ Ошибка" при нажатии

| Причина | Решение |
|---------|---------|
| Видео ещё не переведено | Подожди 1-2 минуты и попробуй снова |
| Worker недоступен | Проверь интернет, попробуй позже |
| CORS блокировка | Убедись что используешь worker proxy |
| Mixed Content | Аудио должно быть HTTPS |

### Нет звука перевода

- Проверь громкость в микшере браузера
- Нажми play на видео (аудио синхронизируется)
- Проверь консоль (F12 → Console) на ошибки

### Кнопка не появляется

- Убедись что ты на странице просмотра (`/watch?v=...`)
- Подожди 2-3 секунды — плеер загружается динамически
- Обнови страницу

## 📋 TODO

- [ ] Выбор языка перевода (не только EN→RU)
- [ ] Субтитры
- [ ] Поддержка Twitch
- [ ] Поддержка VK Video
- [ ] Регулировка громкости перевода
- [ ] Автоперевод всех видео
- [ ] История переводов
- [ ] Кэширование

## 📝 Лицензия

MIT — для образовательных целей. Все права на Yandex VOT API принадлежат Яндексу.

## 🙏 Благодарности

- [vot.js](https://github.com/FOSWLY/vot.js) — библиотека для работы с Yandex VOT API
- [vot-worker](https://github.com/FOSWLY/vot-worker) — proxy сервер
- [voice-over-translation](https://github.com/ilyhalight/voice-over-translation) — оригинальное расширение
