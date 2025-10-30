# Deploying Vibe Commerce to Render

This guide will help you deploy both the backend and frontend of Vibe Commerce to Render.

## Prerequisites

- GitHub account with the vibe-ecommerce repository
- Render account (free tier available at https://render.com)
- MongoDB Atlas account with a cluster set up

## Deployment Options

### Option 1: Using Render Blueprint (Recommended - Fastest)

This method uses the `render.yaml` file to automatically deploy both services.

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Blueprint"

2. **Connect Your Repository**
   - Select "Connect a repository"
   - Choose `jayashish05/vibe-ecommerce`
   - Click "Connect"

3. **Configure Environment Variables**
   
   Render will detect the `render.yaml` file. You need to set these secret environment variables:
   
   **For Backend Service:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: `vibe_commerce_secret_key_2025_secure_token`
   
   **For Frontend Service:**
   - `REACT_APP_API_URL`: Will be `https://vibe-commerce-backend.onrender.com/api` (use your actual backend URL)

4. **Deploy**
   - Click "Apply"
   - Render will automatically deploy both services
   - Wait for both builds to complete (5-10 minutes)

5. **Get Your URLs**
   - Backend: `https://vibe-commerce-backend.onrender.com`
   - Frontend: `https://vibe-commerce-frontend.onrender.com`

6. **Update CORS Settings**
   
   After deployment, update `backend/server.js` to include your frontend URL:
   
   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://vibe-commerce-frontend.onrender.com'  // Add your actual frontend URL
     ],
     credentials: true
   };
   ```
   
   Commit and push this change - Render will auto-deploy.

---

### Option 2: Manual Deployment (Step-by-Step)

If you prefer manual control or the Blueprint doesn't work, follow these steps:

#### Step 1: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Make sure your cluster allows connections from anywhere:
   - Navigate to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows Render to connect)
3. Copy your connection string from "Connect" → "Connect your application"

#### Step 2: Deploy Backend

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `jayashish05/vibe-ecommerce`

2. **Configure Backend Service**
   - **Name**: `vibe-commerce-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

3. **Add Environment Variables**
   
   Click "Advanced" → "Add Environment Variable":
   
   | Key | Value |
   |-----|-------|
   | `PORT` | `5001` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | `vibe_commerce_secret_key_2025_secure_token` |
   | `JWT_EXPIRE` | `30d` |

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://vibe-commerce-backend.onrender.com`)

#### Step 3: Deploy Frontend

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository: `jayashish05/vibe-ecommerce`

2. **Configure Frontend Service**
   - **Name**: `vibe-commerce-frontend`
   - **Root Directory**: `frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Add Environment Variable**
   
   Click "Advanced" → "Add Environment Variable":
   
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://vibe-commerce-backend.onrender.com/api` |
   
   **Important**: Replace with your actual backend URL from Step 2!

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)

#### Step 4: Update CORS Settings

1. Open `backend/server.js` in your local repository
2. Update the CORS configuration:

   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://vibe-commerce-frontend.onrender.com'  // Your actual frontend URL
     ],
     credentials: true
   };
   
   app.use(cors(corsOptions));
   ```

3. Commit and push:
   ```bash
   git add backend/server.js
   git commit -m "Update CORS for production frontend"
   git push origin main
   ```

4. Render will automatically redeploy the backend

---

## Verification

### Test Backend
```bash
curl https://vibe-commerce-backend.onrender.com/api/products
```

You should see a JSON response with products.

### Test Frontend
1. Open your frontend URL in a browser
2. Products should load automatically
3. Try signing up and logging in
4. Add items to cart and complete checkout

---

## Important Notes

### Free Tier Limitations
- **Cold Starts**: Free tier services spin down after 15 minutes of inactivity
- **First Request**: May take 30-60 seconds to wake up
- **Monthly Limit**: 750 hours per service (sufficient for one service)

### Environment Variables
- Backend `MONGODB_URI`: Must allow connections from `0.0.0.0/0`
- Frontend `REACT_APP_API_URL`: Must end with `/api`
- Backend `JWT_SECRET`: Keep this secret and secure

### Auto-Deploy
- Both services auto-deploy when you push to the `main` branch
- Check deployment logs if issues occur

---

## Troubleshooting

### Issue: "Failed to load products"
**Solution**: 
1. Check that backend is deployed and running
2. Verify `REACT_APP_API_URL` in frontend settings
3. Check browser console for CORS errors

### Issue: CORS errors
**Solution**: 
1. Verify frontend URL is in backend CORS configuration
2. Make sure you committed and pushed the CORS update
3. Check Render logs for backend service

### Issue: "Cannot connect to MongoDB"
**Solution**:
1. Verify MongoDB Atlas allows connections from `0.0.0.0/0`
2. Check `MONGODB_URI` environment variable is correct
3. Test connection string locally first

### Issue: Backend returns 404
**Solution**:
1. Check the backend URL includes `/api` in the frontend config
2. Verify backend start command is `node server.js`
3. Check backend logs in Render dashboard

### Issue: Frontend shows blank page
**Solution**:
1. Check browser console for errors
2. Verify build completed successfully in Render logs
3. Check that `REACT_APP_API_URL` was set before build

---

## Monitoring

### Check Service Status
1. Go to Render Dashboard
2. Click on each service
3. View "Logs" tab for real-time logs
4. Check "Metrics" for performance data

### View Logs
```bash
# In Render Dashboard
Services → [Service Name] → Logs
```

---

## Updating Your App

### After Code Changes
1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. Render automatically detects the push and redeploys

### Manual Redeploy
1. Go to Render Dashboard
2. Click on service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## Next Steps

After successful deployment:
1. ✅ Test all features (signup, login, cart, checkout)
2. ✅ Set up custom domain (optional, available in Render settings)
3. ✅ Enable HTTPS (automatic with Render)
4. ✅ Monitor application logs
5. ✅ Consider upgrading to paid tier for better performance

---

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Issues**: https://github.com/jayashish05/vibe-ecommerce/issues

Your Vibe Commerce app is now ready for production! 🚀
