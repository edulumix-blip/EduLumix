# Netlify — EduLumix frontend

Backend stays on **Render**; static hosting on Netlify. Auth is **email + password** only (no Firebase).

## Git-connected deploy (recommended)

1. Netlify → **Add new site** → Import from **Git** → pick `edulumix-blip/EduLumix` (or your repo).
2. Build settings (repo root `netlify.toml` sets these if the file is picked up):
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist` (relative to base `frontend/`).
3. **Environment variables** (Site settings → Environment variables):

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://edulumix.onrender.com/api` |
| `VITE_APP_URL` | `https://yoursite.netlify.app` (later your custom domain) |
| `VITE_ADS_SLOT_*` | Optional AdSense slots |

4. **Render CORS:** set `CLIENT_URL` to your Netlify URL. The API also allows `*.netlify.app`.

## CLI (optional)

From `frontend/` after `npm run build`:

```bash
npx netlify deploy --prod --dir=dist
```

## SPA routing

`public/_redirects` is copied into `dist` by Vite so all routes rewrite to `index.html`.
