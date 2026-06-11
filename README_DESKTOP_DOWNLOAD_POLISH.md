# Grizzly OS — Desktop Download Polish

Що додано:

- `/download` — сторінка скачування Windows-додатку в OS стилі.
- Кнопка скачування веде на GitHub Latest Release:
  `https://github.com/Crowsk1ck/Grizzly_OS/releases/latest/download/Grizzly-OS-Setup.exe`
- Постійна назва installer-файлу: `Grizzly-OS-Setup.exe`.
- `package.json` оновлено до версії `1.0.2`.
- GitHub publish owner виправлено на `Crowsk1ck`, repo `Grizzly_OS`.
- `electron-updater` зафіксовано на стабільній версії `^6.3.9`.
- Додано splash screen: `electron/splash.html`.
- Додано Electron zoom fix: `setZoomFactor(0.9)`.
- Додано IPC `desktop:getAppInfo` для версії додатку на сторінці `/download`.

## Запуск

```bash
npm install
npm run desktop
```

## Збірка exe

```bash
npm run build:desktop
```

## Публікація нового auto-update release

1. Перевір версію в `package.json`, наприклад `1.0.2`.
2. У PowerShell:

```powershell
$env:GH_TOKEN="твій_GitHub_token"
npm run publish:desktop
```

Після цього GitHub Releases має отримати:

- `Grizzly-OS-Setup.exe`
- `Grizzly-OS-Setup.exe.blockmap`
- `latest.yml`
