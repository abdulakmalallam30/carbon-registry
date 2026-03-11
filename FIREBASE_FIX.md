# Quick Fix: Enable Firebase Authentication

## Follow these steps:

### 1. Go to Firebase Console
Open: https://console.firebase.google.com/project/carbon-cf468/authentication

### 2. Enable Authentication
- Click on **"Authentication"** in the left sidebar
- Click **"Get Started"** button (if you see it)

### 3. Enable Email/Password Sign-in
- Go to the **"Sign-in method"** tab
- Find **"Email/Password"** in the list
- Click on it
- Toggle **"Enable"** to ON
- Click **"Save"**

### 4. (Optional) Enable Email Link Sign-in
- You can leave "Email link (passwordless sign-in)" DISABLED for now

### 5. Refresh Your App
- Go back to http://localhost:3000/login
- Try creating an account again

---

## Alternative: Use Firebase CLI

If you prefer command line:

```bash
# Already installed: firebase-tools
firebase login
firebase init auth
```

---

## Still Having Issues?

Check these:
1. ✅ Verify your Firebase project ID is correct: **carbon-cf468**
2. ✅ Make sure you're logged into the correct Google account
3. ✅ Check that the project exists at: https://console.firebase.google.com/

## Test After Setup:
1. Go to http://localhost:3000/login
2. Click "Don't have an account? Sign up"
3. Select a role (NGO, Industry, or Admin)
4. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
5. Click "Create Account"

This should work once Email/Password is enabled! 🔥
