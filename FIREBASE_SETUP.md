# Firebase Authentication Setup Guide

## 🔥 Firebase Configuration

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `carbon-registry` (or your preferred name)
4. Accept terms and click **Continue**
5. Disable Google Analytics (optional) or configure it
6. Click **Create project**

### Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (</>) to add a web app
2. Enter app nickname: `Carbon Registry Web App`
3. **DO NOT** check "Firebase Hosting" (we're using Vite dev server)
4. Click **Register app**
5. **Copy the Firebase configuration** (you'll need this next)

### Step 3: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Click on **Email/Password**
5. Enable the **Email/Password** toggle
6. Click **Save**

### Step 4: Set Up Firestore Database

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location (choose closest to you)
5. Click **Enable**

### Step 5: Configure Firebase Security Rules

Go to **Firestore Database** → **Rules** tab and update with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Step 6: Configure Your Application

1. Copy `frontend/.env.example` to `frontend/.env`:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `.env` and paste your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=AIza...your_key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Save the file

### Step 7: Test the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Try creating accounts with different roles:
   - NGO/Project Owner
   - Industry/Buyer
   - Administrator

## 👥 User Roles

### 🌱 NGO / Project Owner
- **Purpose**: Register plantation projects and environmental initiatives
- **Capabilities**:
  - Register new carbon offset projects
  - View their own projects
  - Track project status

### 🏭 Industry / Buyer
- **Purpose**: Purchase carbon credits to offset emissions
- **Capabilities**:
  - Browse available carbon credits
  - Purchase credits
  - View purchase history
  - Retire credits

### 👨‍💼 Administrator
- **Purpose**: Verify projects and issue carbon credits
- **Capabilities**:
  - View all projects
  - Verify/reject projects
  - Issue carbon credits to verified projects
  - Manage the entire platform

## 🔒 Security Features

- ✅ Email/Password authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes
- ✅ User data stored in Firestore
- ✅ Firebase security rules

## 🚀 Quick Start

1. **Create an NGO account** to register projects
2. **Create an Admin account** to verify and issue credits
3. **Create an Industry account** to purchase credits

## 📝 Testing Accounts

For testing, you can create these sample accounts:

```
NGO:
Email: ngo@test.com
Password: test123
Role: NGO

Industry:
Email: industry@test.com
Password: test123
Role: Industry

Admin:
Email: admin@test.com
Password: test123
Role: Admin
```

## 🆘 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your API key in `.env` is correct
- Ensure the `.env` file is in the `frontend` folder
- Restart the development server

### "Missing or insufficient permissions"
- Update your Firestore security rules
- Make sure you're signed in
- Check that your user role is set correctly in Firestore

### Authentication not working
- Verify Email/Password is enabled in Firebase Console
- Check browser console for errors
- Clear browser cache and cookies

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
