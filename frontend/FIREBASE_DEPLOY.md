# Firebase Hosting - EduLumix Frontend Deploy

## Prerequisites

1. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login** (opens browser for Google sign-in):
   ```bash
   firebase login
   ```

3. **Project** already linked in `.firebaserc` (edulumix-9c6d7)

## Deploy Steps

### Option 1: Single Command
```bash
cd frontend
npm run deploy:firebase
```

### Option 2: Manual
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## After Deploy

- **URL:** https://edulumix-9c6d7.web.app (or your custom domain)
- **Firebase Console:** https://console.firebase.google.com/ → Your Project → Hosting

## Firebase Auth (Google Login)

To enable "Continue with Google" on the Login page:

1. **Firebase Console** → Authentication → Sign-in method → Enable **Google**
2. **Frontend** `.env` – add Firebase config:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=edulumix-9c6d7.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=edulumix-9c6d7
   VITE_FIREBASE_STORAGE_BUCKET=edulumix-9c6d7.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. **Backend** `.env` – add:
   ```
   FIREBASE_PROJECT_ID=edulumix-9c6d7
   GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
   ```
   (Get service account from Firebase Console → Project Settings → Service Accounts → Generate new private key)
