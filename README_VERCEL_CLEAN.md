# Grizzly Family — Vercel Clean Build

This ZIP is cleaned for the **web site / Vercel deploy** only.

Removed from the web project:
- Electron desktop app files
- Electron build scripts
- Electron dependencies
- desktop release output
- prebuilt `dist`
- old package lock with desktop dependencies

Use this repo for Vercel:

```bash
npm install
npm run dev
npm run build
```

Vercel settings:

```text
Install Command: npm install --omit=dev --ignore-scripts --no-audit --no-fund
Build Command: npm run build
Output Directory: dist
```

The Windows desktop app should stay in the separate repository:

```text
https://github.com/Crowsk1ck/Grizzly_OS
```

The `/download` page still links to the latest Windows installer from GitHub Releases.
