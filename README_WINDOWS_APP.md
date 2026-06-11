# Grizzly OS — Windows Desktop App

У проєкт додано Electron-обгортку для Windows.

## Що додано

- `electron/main.js` — головне вікно Windows-додатку
- `electron/preload.cjs` — безпечний desktop bridge
- `public/icon.ico` — іконка програми
- Electron scripts у `package.json`
- `electron-builder` config для `.exe`
- `HashRouter` для desktop-режиму
- `base: './'` у Vite для коректної desktop-збірки

## Запуск тестової desktop-версії

```bash
npm install
npm run desktop
```

Це відкриє React/Vite сайт у вікні Grizzly OS.

## Збірка Windows .exe

```bash
npm run build:desktop
```

Після збірки файл буде тут:

```text
release/Grizzly-OS-1.0.0-win-x64.exe
```

## Portable-версія без інсталятора

```bash
npm run build:desktop:portable
```

## Важливо про режим роботи

У packaged-режимі додаток за замовчуванням відкриває сайт:

```text
https://www.grizzly-family.online
```

Це зроблено, щоб Discord OAuth, API, Vercel endpoints і авторизація працювали нормально.

Для тесту локальної production-збірки можна запускати з env:

PowerShell:

```powershell
$env:GRIZZLY_DESKTOP_MODE="local"
npm run build:desktop
```

CMD:

```bat
set GRIZZLY_DESKTOP_MODE=local
npm run build:desktop
```

Але в local static mode serverless API `/api/...` не працює, бо це вже не Vercel-сервер.

## Корисні клавіші

- `Ctrl + R` — reload
- `F11` — fullscreen
- `Ctrl + Shift + I` — DevTools
- `Ctrl + B` — сховати/показати sidebar на сайті

