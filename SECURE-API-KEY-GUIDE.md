# Secure API Key Setup Guide

**How to Store Twelve Data API Key Securely Using GitHub**

---

## 🔒 Problem

Currently, the API key is hardcoded in `index.html`:
```javascript
const TWELVE_DATA_API_KEY = 'YOUR_API_KEY_HERE'; // ❌ Exposed in code
```

This is **NOT secure** because:
- ❌ API key visible in GitHub repository
- ❌ Anyone can see and steal your key
- ❌ Public in browser source code
- ❌ Can be abused by others

---

## ✅ Solution Options

### **Option 1: GitHub Secrets + Backend Proxy** (Most Secure)
**Best for production websites**

### **Option 2: Environment Variables + Build Process** (Good)
**Best for static sites with build step**

### **Option 3: Separate Config File (Not in Git)** (Basic)
**Simple but requires manual setup**

---

## 🎯 RECOMMENDED: Option 1 - Backend Proxy

Since your site is **frontend-only** (static HTML/CSS/JS), the most secure approach is to create a simple backend API that:
1. Stores your API key securely
2. Acts as a proxy between your frontend and Twelve Data
3. Your frontend never exposes the API key

### Architecture:

```
Browser → Your Backend API → Twelve Data API
         (API key hidden)    (gets real data)
```

---

## 🚀 Implementation Guide

### Step 1: Create Backend Proxy (Node.js)

Create a new folder for your backend:

```bash
mkdir mf-portal-api
cd mf-portal-api
npm init -y
npm install express cors dotenv node-fetch
```

### Step 2: Create `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
    origin: ['http://localhost:3000', 'https://infraxcoders.github.io']
}));

// Stock quote endpoint
app.get('/api/stock/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { exchange } = req.query;
        
        const apiKey = process.env.TWELVE_DATA_API_KEY;
        const url = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        res.json(data);
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'API proxy is running' });
});

app.listen(PORT, () => {
    console.log(`✅ API Proxy running on port ${PORT}`);
});
```

### Step 3: Create `.env` File

```bash
TWELVE_DATA_API_KEY=your_actual_api_key_here
PORT=3001
```

### Step 4: Create `.gitignore`

```
node_modules/
.env
.DS_Store
```

### Step 5: Deploy Backend

**Option A: Render.com (Free)**
1. Push backend code to separate GitHub repo
2. Go to https://render.com
3. Create new "Web Service"
4. Connect your backend repo
5. Add environment variable: `TWELVE_DATA_API_KEY`
6. Deploy (free tier available)

**Option B: Railway.app (Free)**
1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub
4. Add environment variable
5. Get your backend URL

**Option C: Vercel (Free)**
1. Create `api/stock.js` (serverless function)
2. Deploy to Vercel
3. Add env variables in Vercel dashboard

### Step 6: Update Frontend

In `index.html`, replace the API call:

```javascript
// OLD (direct call - exposes key)
const url = `https://api.twelvedata.com/quote?symbol=${cleanSymbol}&exchange=${exchange}&apikey=${TWELVE_DATA_API_KEY}`;

// NEW (via your proxy - key hidden)
const BACKEND_API = 'https://your-backend-api.onrender.com'; // Your deployed backend URL
const url = `${BACKEND_API}/api/stock/${cleanSymbol}?exchange=${exchange}`;
```

---

## 🎯 SIMPLER OPTION: Environment Variables for Static Sites

### For GitHub Pages Deployment

Since GitHub Pages is static (no server-side code), you have two choices:

#### **Choice 1: Accept API Key is Visible** (Current Setup)
- ✅ Simple to implement
- ✅ Works immediately
- ⚠️ API key visible in source code
- ⚠️ Can be stolen but has rate limits
- ⚠️ Twelve Data has 800/day limit per key
- ✅ Quick to revoke and replace key if needed

**Mitigation:**
- Use Twelve Data dashboard to monitor usage
- Set up usage alerts
- Regenerate API key if abused
- Rate limiting protects you somewhat

#### **Choice 2: Use Backend Proxy** (Recommended for Production)
- ✅ API key completely hidden
- ✅ More secure
- ✅ Can add additional security (rate limiting, auth)
- ⚠️ Requires backend server
- ⚠️ Extra deployment step

---

## 📋 Quick Decision Matrix

| Factor | Frontend Only (Exposed Key) | Backend Proxy (Secure) |
|--------|----------------------------|------------------------|
| **Security** | ⚠️ Low (key visible) | ✅ High (key hidden) |
| **Setup Time** | ✅ 2 minutes | ⚠️ 30 minutes |
| **Cost** | ✅ Free (GitHub Pages) | ✅ Free (Render/Railway) |
| **Maintenance** | ✅ None | ⚠️ Backend to maintain |
| **Speed** | ✅ Fast (direct) | ⚠️ Slightly slower (proxy) |
| **For Production** | ⚠️ Not recommended | ✅ Recommended |

---

## 🎯 My Recommendation for Your Project

### For Now (Testing/Development):
```javascript
// Keep API key in code for testing
const TWELVE_DATA_API_KEY = 'your_test_api_key';
```

### For Production:
1. **Create backend proxy** (30 min setup)
2. **Deploy to Render.com** (free tier)
3. **Add API key as environment variable**
4. **Update frontend to call your proxy**

---

## 🔐 Alternative: API Key in Separate File (Not in Git)

### Step 1: Create `api-keys.js`

```javascript
// api-keys.js - DO NOT COMMIT TO GIT
window.API_KEYS = {
    TWELVE_DATA: 'your_actual_api_key_here'
};
```

### Step 2: Add to `.gitignore`

```
api-keys.js
```

### Step 3: Update `index.html`

```html
<!-- Load API keys (not in git) -->
<script src="api-keys.js"></script>

<script>
    const TWELVE_DATA_API_KEY = window.API_KEYS?.TWELVE_DATA || 'demo_key';
</script>
```

### Step 4: Create `api-keys.example.js`

```javascript
// api-keys.example.js - COMMIT THIS
// Copy this file to api-keys.js and add your real keys
window.API_KEYS = {
    TWELVE_DATA: 'YOUR_API_KEY_HERE'
};
```

**Pros:**
- ✅ Key not in git repository
- ✅ Easy to setup

**Cons:**
- ⚠️ Still visible in browser source code
- ⚠️ Manual setup on each deployment
- ⚠️ Not truly secure (client-side)

---

## 🏆 BEST PRACTICE: Backend Proxy Setup

### Quick Render.com Deployment

1. **Create Backend Folder:**
```bash
mkdir stock-api-proxy
cd stock-api-proxy
npm init -y
npm install express cors dotenv
```

2. **Create Files:**

`server.js`:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { exchange } = req.query;
    
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
```

`package.json`:
```json
{
  "name": "stock-api-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

3. **Deploy to Render.com:**
- Push to GitHub (separate repo or folder)
- Go to https://render.com
- Create "Web Service"
- Connect repo
- Add env var: `TWELVE_DATA_API_KEY=your_key`
- Deploy!

4. **Update Frontend:**
```javascript
const BACKEND_API = 'https://your-app.onrender.com';
const url = `${BACKEND_API}/api/stock/${cleanSymbol}?exchange=${exchange}`;
```

---

## ⚡ Fastest Secure Solution: Vercel Serverless Function

### Create `api/stock.js`:

```javascript
// api/stock.js
export default async function handler(req, res) {
    const { symbol, exchange } = req.query;
    
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    const url = `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange}&apikey=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
}
```

### Deploy:
```bash
vercel --prod
```

### Add Environment Variable:
```bash
vercel env add TWELVE_DATA_API_KEY
# Enter your API key when prompted
```

---

## 📝 Summary

### For Testing Right Now:
✅ Use hardcoded API key in `index.html`
✅ Test that everything works
✅ Don't push to public GitHub yet

### For Production:
1. ✅ Create backend proxy (Render/Railway/Vercel)
2. ✅ Store API key in environment variables
3. ✅ Update frontend to call your proxy
4. ✅ Push to GitHub (no secrets exposed)

### Quick Steps:
1. Get backend URL from Render/Railway/Vercel
2. Replace direct API calls with your proxy
3. Add API key to hosting platform's env vars
4. Deploy and test

---

**Need help with any specific option? Let me know!** 🚀

