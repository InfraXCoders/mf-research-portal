# 📡 Mutual Fund API Integration Guide

Complete guide to integrating real-time mutual fund data into your research portal.

---

## 🌟 Available APIs for Indian Mutual Funds

### 1. **MFApi.in** (FREE - Recommended)
- **Website**: https://www.mfapi.in/
- **Cost**: FREE
- **Rate Limit**: Reasonable (no strict limits)
- **Data**: NAV data for all Indian mutual funds
- **Authentication**: None required

#### Endpoints:
```javascript
// Get all mutual fund schemes
GET https://api.mfapi.in/mf

// Get specific scheme details with historical NAV
GET https://api.mfapi.in/mf/{schemeCode}

// Get latest NAV only
GET https://api.mfapi.in/mf/{schemeCode}/latest
```

#### Example Response:
```json
{
  "meta": {
    "fund_house": "Nippon India Mutual Fund",
    "scheme_type": "Open Ended Schemes",
    "scheme_category": "Equity Scheme - Small Cap Fund",
    "scheme_code": 119551,
    "scheme_name": "Nippon India Small Cap Fund - Growth Plan - Growth Option"
  },
  "data": [
    {
      "date": "06-10-2025",
      "nav": "125.4567"
    }
  ],
  "status": "SUCCESS"
}
```

---

### 2. **RapidAPI - MF API** (PAID)
- **Website**: https://rapidapi.com/
- **Cost**: Free tier available, then $10-50/month
- **Rate Limit**: Based on plan
- **Features**: More reliable, faster updates

#### Setup:
```javascript
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'YOUR_API_KEY',
        'X-RapidAPI-Host': 'latest-mutual-fund-nav.p.rapidapi.com'
    }
};

fetch('https://latest-mutual-fund-nav.p.rapidapi.com/fetchAllSchemes', options)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

### 3. **AMFI India** (FREE - Official Source)
- **Website**: https://www.amfiindia.com/
- **Cost**: FREE
- **Format**: Text file (requires parsing)
- **Update**: Daily at 8 PM IST

#### Endpoint:
```
GET https://www.amfiindia.com/spages/NAVAll.txt
```

#### Data Format (Semicolon separated):
```
Scheme Code;ISIN Div Payout;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
```

---

### 4. **BSE Star MF API** (Registration Required)
- **Website**: https://bsestarmf.in/
- **Cost**: FREE (requires BSE registration)
- **Features**: Official BSE data, transaction capabilities
- **Best For**: Professional integrations

---

## 🚀 Quick Start Implementation

### Step 1: Basic Integration

```javascript
// Initialize the API service
const apiService = new MutualFundAPIService();
await apiService.initialize();

// Fetch all schemes
const schemes = await apiService.getAllSchemes();
console.log(`Loaded ${schemes.length} mutual fund schemes`);

// Get specific scheme details
const schemeDetails = await apiService.getSchemeDetails('119551');
console.log('Scheme:', schemeDetails.meta.scheme_name);
console.log('Latest NAV:', schemeDetails.latestNav);
console.log('1 Year Return:', schemeDetails.returns.oneYear.value + '%');
```

---

### Step 2: Display Real-time Data

```javascript
// Load and display schemes
async function loadMutualFunds() {
    try {
        showLoading(true);
        
        // Fetch data
        const schemes = await apiService.getAllSchemes();
        
        // Filter by category
        const smallCapFunds = schemes.filter(s => 
            s.schemeName.toLowerCase().includes('small cap')
        );
        
        // Display in UI
        displaySchemes(smallCapFunds);
        
        showLoading(false);
        showNotification('Data loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to load data', 'error');
    }
}
```

---

### Step 3: Calculate Returns

```javascript
// Calculate investment returns
const investment = {
    amount: 100000,
    returnRate: 18.5,
    years: 5
};

const result = apiService.calculateInvestmentGrowth(
    investment.amount,
    investment.returnRate,
    investment.years
);

console.log('Invested:', result.invested);
console.log('Current Value:', result.current);
console.log('Gain:', result.gain);
console.log('Gain %:', result.gainPercent);
```

---

### Step 4: SIP Calculator

```javascript
// Calculate SIP returns
const sip = {
    monthlyAmount: 5000,
    returnRate: 12,
    years: 10
};

const sipResult = apiService.calculateSIPReturns(
    sip.monthlyAmount,
    sip.returnRate,
    sip.years
);

console.log('Total Invested:', sipResult.invested);
console.log('Maturity Value:', sipResult.current);
console.log('Wealth Gain:', sipResult.gain);
```

---

## 🎯 Popular Scheme Codes

| Scheme Name | Code | AMC |
|------------|------|-----|
| Nippon India Small Cap Fund | 119551 | Nippon India |
| HDFC Small Cap Fund | 120503 | HDFC |
| SBI Small Cap Fund | 112090 | SBI |
| Axis Small Cap Fund | 118989 | Axis |
| Kotak Small Cap Fund | 120424 | Kotak |
| Parag Parikh Flexi Cap Fund | 122639 | PPFAS |
| Quant Active Fund | 145427 | Quant |

---

## 💾 Caching Strategy

Implement caching to reduce API calls:

```javascript
// Cache configuration
const CACHE_TTL = {
    schemes: 24 * 60 * 60 * 1000,    // 24 hours
    nav: 60 * 60 * 1000,              // 1 hour
    performance: 60 * 60 * 1000       // 1 hour
};

// Check cache before API call
function getCachedData(key, ttl) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;
    
    return age < ttl ? data.value : null;
}

// Set cache
function setCache(key, value) {
    const data = {
        value,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
}
```

---

## ⚡ Rate Limiting

Respect API rate limits:

```javascript
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }
    
    async throttle() {
        const now = Date.now();
        
        // Remove old requests
        this.requests = this.requests.filter(
            time => now - time < this.windowMs
        );
        
        // Check limit
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.windowMs - (now - oldestRequest);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.requests.push(now);
    }
}

// Usage
const limiter = new RateLimiter(60, 60000); // 60 requests per minute
await limiter.throttle();
// Make API call
```

---

## 🔒 Error Handling

Implement robust error handling:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            
            if (i === maxRetries - 1) {
                throw error;
            }
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, i) * 1000)
            );
        }
    }
}
```

---

## 📊 Performance Optimization

### 1. **Lazy Loading**
Load data only when needed:

```javascript
// Load only visible funds
function loadVisibleFunds() {
    const visibleElements = document.querySelectorAll('.fund-card[data-scheme-code]');
    
    visibleElements.forEach(async (element) => {
        if (isElementInViewport(element)) {
            const schemeCode = element.dataset.schemeCode;
            const data = await apiService.getSchemeDetails(schemeCode);
            updateFundCard(element, data);
        }
    });
}
```

### 2. **Batch Requests**
Combine multiple API calls:

```javascript
async function fetchMultipleSchemes(schemeCodes) {
    const promises = schemeCodes.map(code => 
        apiService.getSchemeDetails(code)
    );
    
    return await Promise.all(promises);
}
```

### 3. **Service Workers**
Cache API responses offline:

```javascript
// service-worker.js
self.addEventListener('fetch', event => {
    if (event.request.url.includes('api.mfapi.in')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
```

---

## 🔧 Troubleshooting

### Common Issues:

**1. CORS Errors**
```javascript
// Use proxy for development
const PROXY = 'https://cors-anywhere.herokuapp.com/';
fetch(PROXY + 'https://api.mfapi.in/mf');
```

**2. Rate Limiting**
- Implement caching
- Use exponential backoff
- Batch requests when possible

**3. API Downtime**
- Always have fallback data
- Implement retry logic
- Show meaningful error messages

---

## 📱 Mobile Considerations

```javascript
// Check network status
if (!navigator.onLine) {
    showNotification('No internet connection', 'error');
    loadCachedData();
    return;
}

// Prefetch on WiFi only
if (navigator.connection.effectiveType === '4g' || 
    navigator.connection.type === 'wifi') {
    prefetchData();
}
```

---

## 🎓 Best Practices

1. **Always cache data** - Reduce API calls
2. **Handle errors gracefully** - Show user-friendly messages
3. **Implement loading states** - Better UX
4. **Use Web Workers** - Don't block UI
5. **Monitor performance** - Track API response times
6. **Respect rate limits** - Avoid getting blocked
7. **Keep fallback data** - App works offline
8. **Update daily** - NAV updates once per day

---

## 📚 Additional Resources

- **MFApi Documentation**: https://www.mfapi.in/
- **AMFI India**: https://www.amfiindia.com/
- **BSE Star MF**: https://bsestarmf.in/
- **RapidAPI Hub**: https://rapidapi.com/hub

---

## 🆘 Support

For API integration issues:
- Check browser console for errors
- Verify network requests in DevTools
- Check API status pages
- Review rate limit headers

---

**Happy Coding! 🚀**
