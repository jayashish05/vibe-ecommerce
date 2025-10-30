# Vibe Commerce - Render Deployment Guide

## 🚀 Deploying to Render

This guide will help you deploy both the backend and frontend to Render.

---

## Prerequisites

1. ✅ GitHub repository with your code
2. ✅ MongoDB Atlas account (for database)
3. ✅ Render account (free tier available)

---

## Deployment Steps

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Click **Connect** → **Connect your application**
4. Copy your connection string (it looks like this):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibecommerce?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Keep this connection string safe - you'll need it!

---

### Step 2: Deploy Backend (API)

#### Option A: Using Render Dashboard (Easy)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Click **New +** → **Web Service**

2. **Connect Repository**
   - Connect your GitHub account
   - Select `jayashish05/vibe-ecommerce`
   - Click **Connect**

3. **Configure Service**
   - **Name:** `vibe-commerce-backend` (or any name you like)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add Environment Variables**
   Click **Advanced** → Add these environment variables:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5001` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Any random secure string (e.g., `your-super-secret-jwt-key-2025-vibe`) |
   | `JWT_EXPIRE` | `30d` |

5. **Deploy**
   - Click **Create Web Service**
   - Wait for deployment (takes 2-5 minutes)
   - Copy your backend URL: `https://vibe-commerce-backend.onrender.com`

---

### Step 3: Deploy Frontend (React App)

1. **Update Frontend API URL**
   Before deploying, we need to update the API URL in your frontend code.

2. **Create New Static Site**
   - Go back to Render Dashboard
   - Click **New +** → **Static Site**

3. **Connect Repository**
   - Select `jayashish05/vibe-ecommerce`
   - Click **Connect**

4. **Configure Static Site**
   - **Name:** `vibe-commerce-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

5. **Add Environment Variable**
   Click **Advanced** → Add:
   
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://vibe-commerce-backend.onrender.com/api` |
   
   *(Replace with your actual backend URL from Step 2)*

6. **Deploy**
   - Click **Create Static Site**
   - Wait for deployment (takes 2-5 minutes)
   - Your app will be live at: `https://vibe-commerce-frontend.onrender.com`

---

### Step 4: Update CORS Settings

After deployment, you need to update CORS in your backend to allow requests from your frontend URL.

**In `backend/server.js`, update CORS:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://vibe-commerce-frontend.onrender.com'  // Add your frontend URL
  ],
  credentials: true
}));
```

Then commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy your backend!

---

## ⚙️ Important Notes

### Free Tier Limitations
- **Render Free Tier** puts services to sleep after 15 minutes of inactivity
- **First request** after sleep takes ~30 seconds to wake up
- **MongoDB Atlas Free Tier** has 512MB storage limit

### Automatic Deploys
- Render automatically deploys when you push to GitHub
- Backend deploys when `backend/` folder changes
- Frontend deploys when `frontend/` folder changes

### Environment Variables
- Keep `JWT_SECRET` secure and unique
- Never commit `.env` files to GitHub
- Use Render's environment variable settings

---

## 🧪 Testing Your Deployment

1. **Test Backend:**
   ```bash
   curl https://vibe-commerce-backend.onrender.com/api/products
   ```
   Should return products JSON

2. **Test Frontend:**
   - Visit `https://vibe-commerce-frontend.onrender.com`
   - Try browsing products
   - Test login/signup
   - Test checkout flow

---

## 🔧 Troubleshooting

### Backend won't start?
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend can't connect to backend?
- Check CORS settings in backend
- Verify `REACT_APP_API_URL` is correct
- Check browser console for errors

### Database connection error?
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access
- Verify connection string has correct password
- Check MongoDB cluster is running

---

## 💡 Alternative: Deploy Using `render.yaml`

We've included a `render.yaml` file in the root directory. This allows you to deploy both services at once:

1. Go to Render Dashboard
2. Click **New +** → **Blueprint**
3. Connect your repository
4. Render will detect `render.yaml` and create both services automatically!

---

## 📊 Monitoring

After deployment, you can monitor:
- **Logs:** Real-time logs in Render dashboard
- **Metrics:** CPU, memory usage
- **Deploy History:** See all past deployments
- **Health Checks:** Automatic service monitoring

---

## 🎉 Your App is Live!

Once deployed, share your app:
- **Frontend URL:** `https://vibe-commerce-frontend.onrender.com`
- **Backend API:** `https://vibe-commerce-backend.onrender.com/api`

Congratulations! Your full-stack e-commerce app is now live on the internet! 🚀

---

## 📝 Next Steps

1. **Custom Domain:** Add your own domain in Render settings
2. **SSL Certificate:** Automatically provided by Render
3. **CI/CD:** Already set up - just push to GitHub!
4. **Monitoring:** Set up alerts for downtime
5. **Upgrade:** Consider paid plan for better performance

---

## 🆘 Need Help?

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- Check Render Community Forum for common issues
