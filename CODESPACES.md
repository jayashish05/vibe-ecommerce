# GitHub Codespaces Setup for Vibe Commerce

## Quick Start

1. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure Environment**:
   - Backend `.env` file is already configured with MongoDB Atlas
   - Ports will be automatically forwarded by Codespaces

3. **Start Servers**:
   
   **Option 1 - Using the script (recommended)**:
   ```bash
   chmod +x start-codespaces.sh
   ./start-codespaces.sh
   ```
   
   **Option 2 - Manual start**:
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   node server.js
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

4. **Access the App**:
   - Codespaces will automatically forward ports 3000 (frontend) and 5001 (backend)
   - Click on the "Ports" tab at the bottom of VS Code
   - Click on the globe icon next to port 3000 to open the frontend
   - Make sure port 5001 is set to "Public" visibility

## Important Notes for Codespaces

### Port Visibility
- Go to the "Ports" tab
- Right-click on port 5001 → Change Port Visibility → Public
- Right-click on port 3000 → Change Port Visibility → Public

### CORS Configuration
The backend is already configured to accept requests from any origin (`*`), which works in Codespaces.

### Environment Variables
No changes needed - the app automatically detects Codespaces and adjusts the API URL accordingly.

### Troubleshooting

**Problem: "Failed to load products"**
- Solution: Make sure both backend (port 5001) and frontend (port 3000) are running
- Check that port 5001 is set to "Public" in the Ports tab

**Problem: CORS errors**
- Solution: Verify that `backend/server.js` has CORS enabled (already configured)

**Problem: MongoDB connection issues**
- Solution: The connection string in `.env` should work. If not, check your MongoDB Atlas network access settings

**Problem: Ports not forwarding**
- Solution: 
  1. Go to Ports tab
  2. Click "+ Forward a Port"
  3. Enter 3000 and 5001
  4. Set both to Public

## Testing the API

Once the backend is running, test it:
```bash
curl https://YOUR-CODESPACE-URL-5001.app.github.dev/api/products
```

Replace `YOUR-CODESPACE-URL-5001` with your actual Codespace URL for port 5001.
