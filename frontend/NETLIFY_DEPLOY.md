# Netlify — EduLumix frontend

Backend stays on **Render**; only static hosting moves here.

## Git-connected deploy (recommended)

1. Netlify → **Add new site** → Import from **Git** → pick `edulumix-blip/EduLumix` (or your repo).
2. Build settings (repo root `netlify.toml` sets these if the file is picked up):
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist` (relative to base `frontend/`; same as `netlify.toml`).
3. **Environment variables** (Site settings → Environment variables):

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com/api` |
| `VITE_APP_URL` | `https://yoursite.netlify.app` (later your custom domain) |
| `VITE_FIREBASE_*` | Same as Firebase Console (Auth still uses Firebase) |

4. **Render CORS:** set `CLIENT_URL` to your Netlify URL (e.g. `https://edulumix.netlify.app`) or add it under `CORS_ALLOWED_ORIGINS`. The API also allows any `*.netlify.app` origin.

5. **Firebase Auth:** Firebase Console → Authentication → Settings → **Authorized domains** → add your Netlify hostname (e.g. `yoursite.netlify.app` and later `edulumix.in`).

## CLI (optional)

From `frontend/` after `npm run build`:

```bash
npx netlify deploy --prod --dir=dist
```

## SPA routing

`public/_redirects` is copied into `dist` by Vite so all routes rewrite to `index.html`.
