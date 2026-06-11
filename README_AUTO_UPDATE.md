# Grizzly OS Auto Update

У проєкт додано автооновлення Electron через `electron-updater` + `electron-builder`.

## Важливо

Auto-update працює тільки у встановленій production-версії `.exe`.
У `npm run desktop`, `win-unpacked` або dev mode оновлення не встановлюються як у реального користувача.

## GitHub Releases

У `package.json` зараз прописано:

```json
"publish": [
  {
    "provider": "github",
    "owner": "Crows1ck",
    "repo": "Grizzlt-rp"
  }
]
```

Якщо твій репозиторій називається інакше — заміни `owner` і `repo`.

## Як випустити оновлення

1. Зміни версію в `package.json`:

```json
"version": "1.0.1"
```

2. Встанови залежності:

```bash
npm install
```

3. Створи GitHub token з правом створювати релізи.

4. У PowerShell перед публікацією:

```powershell
$env:GH_TOKEN="твій_github_token"
```

У CMD:

```bat
set GH_TOKEN=твій_github_token
```

5. Запусти публікацію:

```bash
npm run publish:desktop
```

Electron Builder створить `.exe`, `latest.yml` та інші update-файли й завантажить їх у GitHub Releases.

## Як користувач отримає оновлення

Користувач встановлює `Grizzly OS Setup.exe`.
Коли ти випускаєш нову версію, програма перевіряє оновлення при запуску і кожні 4 години.
Коли оновлення завантажено, програма запропонує перезапуск.

## Ручна перевірка

У меню програми є пункт:

```text
Grizzly OS → Check for Updates
```

Також у renderer доступно:

```js
window.grizzlyDesktop.checkUpdates()
```
