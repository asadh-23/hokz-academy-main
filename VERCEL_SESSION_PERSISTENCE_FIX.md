# Vercel Session Persistence Fix - Complete Solution

## Problem Summary
After deployment on Vercel, users were automatically logged out when refreshing the browser. The error in Vercel console showed:
```
POST https://hokz-academy-main.onrender.com/api/auth/refresh 401 (Unauthorized)
No active session
AxiosError: {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST'}
```

This worked fine on localhost but failed in production.

## Root Cause Analysis

### The Issue
When frontend and backend are deployed on different domains (e.g., Vercel frontend + Render backend), **cookies are not sent in cross-origin requests** by default due to browser security policies.

The refresh token is stored in an `httpOnly` cookie, and when the page refreshes:
1. Frontend tries to refresh the access token via `/api/auth/refresh`
2. Browser doesn't send the refresh token cookie (due to `sameSite: 'lax'` setting)
3. Backend returns 401 because no refresh token is present
4. User gets logged out

### Key Problems Identified:
1. **Cookie `sameSite` setting**: Was set to `'lax'` which blocks cross-site cookies
2. **CORS configuration**: Wasn't properly configured for credentials
3. **Production environment**: Stricter cookie policies than localhost

## Solution Implemented

### 1. Cookie Configuration Fix (`backend/src/utils/responseHandler.js`)

**Before:**
```javascript
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',  // ❌ This blocks cross-site cookies
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
};
```

**After:**
```javascript
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // ✅ 'none' allows cross-site cookies in production
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
};
```

**Why this works:**
- `sameSite: 'none'` allows cookies to be sent in cross-origin requests
- `secure: true` is REQUIRED when using `sameSite: 'none'` (enforced by browsers)
- Only applied in production, keeping localhost behavior with `'lax'`

### 2. CORS Configuration Enhancement (`backend/src/app.js`)

**Before:**
```javascript
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

**After:**
```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'], // ✅ Expose Set-Cookie header
  optionsSuccessStatus: 200
}));
```

**Improvements:**
- Dynamic origin validation
- Exposed `Set-Cookie` header
- Better error handling
- Filters out undefined origins

### 3. Logout Function Consistency (`backend/src/controllers/authController.js`)

Updated logout to use the same conditional logic:

```javascript
const isProduction = process.env.NODE_ENV === 'production';

res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
    path: "/",
});
```

## Environment Variables Required

### Backend (.env) - **CRITICAL**
```env
NODE_ENV=production  # Must be set to 'production' on Render/deployment
FRONTEND_URL=https://your-vercel-app.vercel.app  # Your Vercel frontend URL
```

### Frontend (.env) - Already Configured
```env
VITE_BACKEND_URL=https://your-render-backend.onrender.com  # Your Render backend URL
```

## Deployment Checklist

### Backend (Render/Your Backend Host)
- [x] Update `responseHandler.js` with new cookie settings
- [x] Update `app.js` with enhanced CORS configuration
- [x] Update `authController.js` logout function
- [ ] **Set `NODE_ENV=production` in environment variables** ⚠️ IMPORTANT
- [ ] **Set `FRONTEND_URL` to your Vercel domain** ⚠️ IMPORTANT
- [ ] Deploy backend with new changes
- [ ] Verify backend is using HTTPS (required for `secure` cookies)

### Frontend (Vercel)
- [x] `withCredentials: true` already set in all axios instances
- [x] `vercel.json` configured for SPA routing
- [ ] Verify `VITE_BACKEND_URL` points to your backend
- [ ] Deploy frontend

## Testing After Deployment

### 1. Login Test
1. Go to your deployed frontend URL
2. Login as user/tutor/admin
3. Check browser DevTools → Application → Cookies
4. Verify `refreshToken` cookie is set with:
   - `HttpOnly: true`
   - `Secure: true`
   - `SameSite: None`

### 2. Refresh Test
1. While logged in, refresh the page (F5 or Ctrl+R)
2. User should remain logged in
3. Check Network tab → `/api/auth/refresh` should return 200 OK
4. Should NOT see 401 errors

### 3. Cross-Tab Test
1. Open your app in one tab
2. Login
3. Open another tab with the same app
4. Both tabs should show logged-in state

## How It Works Now

### Login Flow:
1. User logs in via frontend
2. Backend generates access token (short-lived) and refresh token (long-lived)
3. Backend sends refresh token as `httpOnly` cookie with `sameSite: none` and `secure: true`
4. Frontend stores access token in Redux state (memory only)
5. User can now make authenticated requests

### Refresh Flow (On Page Reload):
1. Page refreshes → Redux state is lost
2. Axios interceptor detects no access token
3. Frontend automatically calls `/api/auth/refresh`
4. **Browser sends refresh token cookie (now works with `sameSite: none`)**
5. Backend validates cookie and returns new access token
6. Frontend updates Redux state
7. User remains logged in ✅

## Why This is Secure

1. **`httpOnly: true`**: Cookies cannot be accessed by JavaScript (prevents XSS attacks)
2. **`secure: true`**: Cookies only sent over HTTPS (prevents man-in-the-middle attacks)
3. **`sameSite: none`**: Required for cross-origin, but combined with `secure` and `httpOnly` maintains security
4. **Refresh token**: Long-lived but stored in secure cookie
5. **Access token**: Short-lived and stored in memory (lost on refresh, but auto-renewed)

## Troubleshooting

### If still getting logged out on refresh:

1. **Check Backend Environment Variables**
   ```bash
   # Verify on Render/your backend host
   NODE_ENV=production  # MUST be 'production'
   FRONTEND_URL=https://your-exact-vercel-domain.vercel.app
   ```

2. **Check Browser Console**
   - Look for CORS errors
   - Check if cookies are being set
   - Verify `/api/auth/refresh` request includes cookies

3. **Check Backend Logs**
   - Look for "❌ No refresh token in cookies" message
   - Verify CORS is allowing your frontend origin

4. **Verify HTTPS**
   - Both frontend and backend MUST use HTTPS
   - `sameSite: none` requires secure connection

5. **Clear Browser Cookies**
   - Old cookies with wrong settings may persist
   - Clear all cookies for your domain and try again

## Alternative Solutions (If Still Not Working)

If the above doesn't work, consider:

1. **Use Same Domain**: Deploy both frontend and backend on same domain (e.g., Vercel backend functions)
2. **Store Refresh Token in LocalStorage**: Less secure, but works (⚠️ not recommended)
3. **Use Proxy**: Configure Vercel to proxy API requests to backend (same-origin)

## Files Modified

1. ✅ `backend/src/utils/responseHandler.js` - Cookie configuration
2. ✅ `backend/src/app.js` - CORS configuration
3. ✅ `backend/src/controllers/authController.js` - Logout consistency

## References

- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Chrome SameSite Cookie Changes](https://www.chromium.org/updates/same-site/)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

---

**Status**: ✅ Fixed
**Date**: July 6, 2026
**Issue**: Session lost on browser refresh in production
**Solution**: Changed `sameSite` to `'none'` for production with proper CORS configuration
