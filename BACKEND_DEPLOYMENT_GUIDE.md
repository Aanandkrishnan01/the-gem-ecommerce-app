# Railway Deployment Guide

## 🚀 Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"

### Step 2: Configure Project
1. Select your repository: `the-gem`
2. Choose "Deploy from subdirectory"
3. Set subdirectory to: `backend`
4. Click "Deploy"

### Step 3: Set Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://aanand:Aanand%400@project.ylnfr71.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=project
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
BCRYPT_ROUNDS=10
```

### Step 4: Custom Start Command (if needed)
If Railway doesn't detect automatically, set:
- Start Command: `node server.js`
- Build Command: `npm install`

### Step 5: Test Deployment
1. Railway will give you a URL like: `https://your-app-name.up.railway.app`
2. Test: `https://your-app-name.up.railway.app/api/health`
3. Should return: `{"message": "eCommerce API is running!"}`

## 🔧 Alternative: Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New" → "Web Service"

### Step 2: Configure Service
1. Connect your GitHub repo
2. Name: `ecommerce-backend`
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`

### Step 3: Set Environment Variables
Add the same variables as Railway above.

## ⚠️ Common Issues & Solutions

### Issue 1: "Module not found"
**Solution**: Make sure `package.json` is in the `backend` folder

### Issue 2: "Database connection failed"
**Solution**: Verify MongoDB Atlas URI is correct and IP whitelist is set to 0.0.0.0/0

### Issue 3: "Port already in use"
**Solution**: Railway/Render automatically assign ports, your app should use `process.env.PORT`

### Issue 4: "Build failed"
**Solution**: Add engines to package.json:
```json
"engines": {
  "node": ">=16.0.0",
  "npm": ">=8.0.0"
}
```

## ✅ Success Indicators
- ✅ Build completes without errors
- ✅ Health endpoint responds: `/api/health`
- ✅ Database connects successfully
- ✅ No port conflicts