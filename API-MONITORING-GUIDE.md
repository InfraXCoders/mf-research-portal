# 📊 API Monitoring Guide

## ✅ **YES! You Can Monitor API Calls on Live Websites**

Complete guide to monitoring all API calls in real-time when your website is deployed on GitHub Pages.

---

## 🎯 **5 Ways to Monitor API Calls**

### **Method 1: Browser Developer Tools (Built-in) ⭐ Recommended**
### **Method 2: Built-in API Monitor Dashboard (Custom)**
### **Method 3: Console Logging (Already Implemented)**
### **Method 4: Google Analytics (Optional)**
### **Method 5: Third-party Tools (Advanced)**

---

## 🔍 **Method 1: Browser Developer Tools**

### **Network Tab - Most Comprehensive**

**Access:**
1. Visit: `https://infraxcoders.github.io/mf-research-portal/`
2. Press: **F12** (Windows) or **Cmd+Option+I** (Mac)
3. Click: **Network** tab
4. Reload: **F5** or **Cmd+R**
5. Filter: Click **XHR** or **Fetch** button

**What You See:**

```
Name                    Status    Type     Size      Time      
mf                      200       fetch    245 KB    2.1s
mf/119551              200       fetch    8.4 KB    856ms
mf/119551/latest       200       fetch    234 B     342ms
```

**Click on any request for details:**

📋 **Headers Tab:**
```
Request URL: https://api.mfapi.in/mf/119551
Request Method: GET
Status Code: 200 OK
Remote Address: 104.21.48.124:443
```

📊 **Response Tab:**
```json
{
  "meta": {
    "fund_house": "Nippon India Mutual Fund",
    "scheme_name": "Nippon India Small Cap Fund - Growth"
  },
  "data": [
    {
      "date": "07-10-2025",
      "nav": "125.4567"
    }
  ]
}
```

⏱️ **Timing Tab:**
- DNS Lookup: 42ms
- Initial Connection: 156ms
- SSL: 234ms
- Request Sent: 2ms
- Waiting (TTFB): 845ms
- Content Download: 18ms
- **Total: 1.297s**

---

## 📊 **Method 2: Built-in API Monitor Dashboard**

I've created a beautiful real-time monitoring dashboard!

### **Access:**

**Locally:**
```bash
open api-monitor.html
```

**On Live Site:**
```
https://infraxcoders.github.io/mf-research-portal/api-monitor.html
```

**Or click "Monitor" button in your main navigation!**

### **Dashboard Features:**

#### **1. Real-time Statistics**
```
┌─────────────────────┐  ┌─────────────────────┐
│  Total API Calls    │  │  Successful Calls   │
│        42           │  │        40           │
└─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   Failed Calls      │  │  Avg Response Time  │
│         2           │  │      1,245ms        │
└─────────────────────┘  └─────────────────────┘
```

#### **2. Response Time Chart**
Visual bar chart showing last 30 API calls with response times.

#### **3. Live API Logs**
```
[10:45:23] ✓ mf/119551 → 200 (856ms)
[10:45:20] ✓ mf → 200 (2,134ms)
[10:45:18] ✗ amfi/NAVAll.txt → Error (0ms)
[10:45:15] ✓ mf/119551/latest → 200 (342ms)
```

#### **4. Performance Table**
| Endpoint | Calls | Success Rate | Avg Time | Status |
|----------|-------|--------------|----------|---------|
| mf | 15 | 100% | 2,145ms | SLOW |
| mf/119551 | 12 | 100% | 856ms | MEDIUM |
| mf/*/latest | 8 | 100% | 342ms | FAST |

#### **5. Controls**
- **Test API Call** - Quick test
- **Load All Schemes** - Bulk test
- **Export Logs** - Download JSON
- **Clear Logs** - Reset dashboard

### **How It Works:**

```javascript
// Automatically intercepts ALL fetch() calls
window.fetch = async function(...args) {
    const startTime = Date.now();
    const response = await originalFetch.apply(this, args);
    const responseTime = Date.now() - startTime;
    
    // Log to dashboard
    logAPICall(url, response.status, responseTime);
    
    return response;
};
```

---

## 🖥️ **Method 3: Console Logging**

Your website already has comprehensive logging!

### **Open Console:**
1. Press **F12**
2. Click **Console** tab

### **What You'll See:**

```javascript
🚀 Initializing MF Research Portal...
✅ API Service initialized
📡 Loading real-time mutual fund data...
🌐 Fetching all schemes from MFApi...
✅ Fetched 40000+ schemes
✅ Updated AMC dropdown with 45 AMCs
🌐 Fetching scheme details for 119551...
✅ Fetched details for Nippon India Small Cap Fund
✅ Application initialized
```

### **Custom Logging:**

You can add more logs in `script.js`:

```javascript
// Add wherever you want to track
console.log('📊 API Call:', endpoint);
console.log('⏱️ Response Time:', time + 'ms');
console.log('✅ Data:', data);
```

---

## 📈 **Method 4: Google Analytics (Optional)**

Track API calls as custom events in Google Analytics.

### **Setup:**

1. Add Google Analytics to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

2. Track API calls in `api-service.js`:
```javascript
// After successful API call
gtag('event', 'api_call', {
    'endpoint': 'mf/119551',
    'response_time': 856,
    'status': 'success'
});
```

3. View in Google Analytics dashboard:
   - Events → Custom Events
   - See API call statistics over time

---

## 🛠️ **Method 5: Third-party Monitoring Tools**

### **A. Sentry (Error Tracking)**

**Setup:**
```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
</script>
```

**Features:**
- Error tracking
- Performance monitoring
- API call traces
- User session replays

### **B. LogRocket (Session Replay)**

**Setup:**
```html
<script src="https://cdn.logrocket.io/LogRocket.min.js"></script>
<script>
  LogRocket.init('your-app-id');
</script>
```

**Features:**
- Session replay
- Network monitoring
- Console logs
- User actions

### **C. DataDog (APM)**

Full application performance monitoring with detailed API metrics.

---

## 📊 **Comparison Table**

| Method | Real-time | Historical | Export | Difficulty | Cost |
|--------|-----------|------------|--------|------------|------|
| **Browser DevTools** | ✅ | ❌ | ✅ (HAR) | Easy | Free |
| **API Monitor Dashboard** | ✅ | ✅ | ✅ (JSON) | Easy | Free |
| **Console Logging** | ✅ | ❌ | ❌ | Easy | Free |
| **Google Analytics** | ❌ | ✅ | ✅ | Medium | Free |
| **Sentry** | ✅ | ✅ | ✅ | Medium | Paid |
| **LogRocket** | ✅ | ✅ | ✅ | Medium | Paid |

---

## 🎯 **Best Practices**

### **For Development:**
✅ Use **Browser DevTools** Network tab  
✅ Check **Console** for detailed logs  
✅ Use **API Monitor Dashboard** for testing  

### **For Production:**
✅ Keep **Console Logging** for basic tracking  
✅ Add **API Monitor** page (password protected)  
✅ Consider **Google Analytics** for long-term stats  
✅ Use **Sentry** if budget allows (for errors)  

### **For Users:**
❌ Don't expose detailed API logs  
✅ Show generic "Loading..." messages  
✅ Handle errors gracefully  

---

## 🚀 **Quick Start Guide**

### **Right Now (Development):**

1. Open your website locally:
```bash
cd /Users/gagandeepsingh/Desktop/Project-Websites/mf-research-portal
npx serve .
```

2. Open in browser and press F12

3. Click Network tab → Filter XHR

4. Use the site and watch API calls

### **After Deployment (Production):**

1. Visit live site:
```
https://infraxcoders.github.io/mf-research-portal/
```

2. Press F12 (works for anyone visiting)

3. Or visit API Monitor:
```
https://infraxcoders.github.io/mf-research-portal/api-monitor.html
```

---

## 📝 **What to Monitor**

### **Key Metrics:**

✅ **Response Time**
- Target: < 2 seconds
- Alert if: > 5 seconds

✅ **Success Rate**
- Target: > 99%
- Alert if: < 95%

✅ **Error Rate**
- Target: < 1%
- Alert if: > 5%

✅ **API Availability**
- Target: 99.9%
- Monitor: MFApi.in status

### **Common Issues:**

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Slow Response** | > 5s | Check API status, internet |
| **CORS Error** | Fetch blocked | Use different API |
| **404 Not Found** | Wrong endpoint | Check API docs |
| **Rate Limited** | 429 status | Add delays, use cache |
| **Timeout** | No response | Retry with backoff |

---

## 🔧 **Troubleshooting**

### **No API Calls Showing?**

**Check:**
1. Network tab is open BEFORE reload
2. Filter is set to XHR/Fetch
3. "Preserve log" is checked
4. No browser extensions blocking

### **Dashboard Not Working?**

**Check:**
1. `api-service.js` is loaded
2. Console for errors
3. Browser compatibility (modern browser needed)
4. HTTPS (if on live site)

### **Slow Performance?**

**Solutions:**
1. Check internet connection
2. Clear browser cache
3. Disable browser extensions
4. Check API status page
5. Review cached data usage

---

## 📚 **Resources**

### **Documentation:**
- Chrome DevTools: https://developer.chrome.com/docs/devtools/
- Firefox DevTools: https://firefox-source-docs.mozilla.org/devtools-user/
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

### **Your Files:**
- `api-monitor.html` - Real-time dashboard
- `api-service.js` - API service with logging
- `script.js` - Console logging

### **External Tools:**
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/
- Google Analytics: https://analytics.google.com/

---

## ✅ **Summary**

### **You Can Monitor API Calls:**

✅ **On Development** - Browser DevTools  
✅ **On Production** - Same DevTools + Dashboard  
✅ **Any Browser** - Works everywhere  
✅ **Real-time** - See calls as they happen  
✅ **Historical** - Export and analyze  
✅ **Free** - No cost for basic monitoring  

### **Best Setup:**

1. **Primary:** Browser DevTools Network tab
2. **Dashboard:** API Monitor page (for demos/testing)
3. **Logging:** Console logs (always on)
4. **Optional:** Google Analytics (long-term trends)

---

## 🎊 **Your Website Has:**

✅ **Built-in console logging** (already implemented)  
✅ **API Monitor dashboard** (just created)  
✅ **Monitor button** (added to navigation)  
✅ **Error handling** (logs failures)  
✅ **Performance tracking** (response times)  

**Ready to use on GitHub Pages!** 🚀

---

**Questions?**
- Test dashboard: `open api-monitor.html`
- Check console: Press F12
- View network: F12 → Network tab

**Happy Monitoring! 📊**