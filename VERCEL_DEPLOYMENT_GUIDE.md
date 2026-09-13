# Vercel Deployment Guide for MobileTravelGuide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Before deploying to Vercel, you must configure environment variables:

1. Copy `.env.local.example` to `.env.local` locally:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials from Firebase Console:
   - Go to Firebase Console → Project Settings
   - Copy your credentials into `.env.local`

3. **Never commit `.env.local`** to Git (it's in `.gitignore`)

### 2. Vercel Deployment Steps

#### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Option B: Using GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Select this repository
4. Vercel auto-detects Next.js configuration
5. Add environment variables in "Environment Variables" section

#### Option C: Manual Setup
1. Deploy: `vercel --prod`
2. Go to Vercel Dashboard
3. Navigate to Project Settings → Environment Variables
4. Add all Firebase credentials with `NEXT_PUBLIC_` prefix

### 3. Environment Variables in Vercel Dashboard

Add these in **Settings → Environment Variables**:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Note:** The `NEXT_PUBLIC_` prefix is required because these are client-side accessible variables.

## Image Handling (Important)

⚠️ **Current Issue:** Base64-encoded images stored in Firestore can cause:
- Slow page loads (images embedded in database)
- Memory issues on serverless functions
- Request size limits on Vercel

### Recommended Solution: Use Firebase Storage
Instead of storing base64 images, use Firebase Storage:

```typescript
// Upload to Firebase Storage
const storageRef = ref(storage, `spots/${id}/image.png`);
await uploadBytes(storageRef, imageFile);
const url = await getDownloadURL(storageRef);

// Store URL in Firestore, not base64
await updateDoc(docRef, { imageUrl: url });
```

Update `TouristSpot.ts`:
```typescript
export interface TouristSpot {
    Attraction_Id: string;
    Name: string;
    Location: string;
    Description: string;
    Attraction_inquiry_id: string;
    Municipality_id: string;
    Rating: number;
    imageUrl?: string;  // Use URL instead of base64
}
```

## Build & Deployment

### Local Build Test
Before deploying, test the production build locally:
```bash
npm run build
npm start
```

### Build Logs
Check Vercel build logs if deployment fails:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click the failed deployment
5. View "Build Logs"

## Troubleshooting

### Issue: "Firebase config is undefined"
**Solution:** Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in Vercel Environment Variables

### Issue: "403 Firestore permission denied"
**Solution:** Update Firestore rules in Firebase Console:
```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
*(Adjust based on your security requirements)*

### Issue: Image upload fails or 413 Request Entity Too Large
**Solution:** Migrate from base64 to Firebase Storage URLs (see Image Handling above)

## Performance Optimization

1. **Enable Caching:** Images from Firebase Storage are cached automatically
2. **Use Next.js Image Component:** Replace `<img>` with `<Image>` from `next/image`
3. **Code Splitting:** Next.js auto-splits route-based chunks

## Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Build succeeds locally (`npm run build`)
- [ ] No `console.log()` statements in production code
- [ ] Firebase Firestore security rules configured
- [ ] Test deployment URL works
- [ ] Mobile responsiveness verified
- [ ] Image upload tested

## Support

- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
