# tysongame

Local Three.js dev server powered by Vite.

## Prereqs
- Node.js 18+ recommended

## Run
```sh
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

## Deploy (GitHub Pages)
- This repo uses Vite, so GitHub Pages should serve the built `dist/` output (not `index.html` + `src/` directly).
- A workflow is included at `.github/workflows/pages.yml` that builds and deploys on pushes to `main`.
- In your repo settings: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
