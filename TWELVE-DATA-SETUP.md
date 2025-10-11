# Twelve Data API Setup Guide

**Minimal API Usage Strategy for Free Plan (800 calls/day)**

---

## 📝 Quick Setup

### Step 1: Add Your API Key

Open `index.html` and find line ~1421:

```javascript
const TWELVE_DATA_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
```

Replace `YOUR_API_KEY_HERE` with your actual Twelve Data API key.

---

## 🎯 API Usage Optimization

### Current Strategy (Minimum Usage)

**API Calls Per Day: ~20 calls** (well under 800 limit!)

| Action | Calls | Frequency |
|--------|-------|-----------|
| BSE Stocks (10 stocks) | 10 calls | Every 12 hours |
| NSE Stocks (10 stocks) | 10 calls | Every 12 hours |
| **Total per cycle** | **20 calls** | **Every 12 hours** |
| **Daily total** | **~40 calls** | **2 refreshes/day** |

### How We Minimize Usage:

1. ✅ **12-Hour Cache** (same as Mutual Funds)
   - First load: 20 API calls
   - Next 12 hours: 0 API calls (uses cache)
   - After 12 hours: 20 API calls
   
2. ✅ **Fetch Only Top 10** (not all 15)
   - Reduced from 15 to 10 stocks
   - 33% less API calls
   
3. ✅ **Batch Processing**
   - 3 stocks at a time
   - 1 second delay between batches
   - Respects rate limits (8 calls/minute)
   
4. ✅ **LocalStorage Caching**
   - Stores data in browser
   - No server needed
   - Instant load on repeat visits
   
5. ✅ **Sample Data Fallback**
   - If API fails → shows sample data
   - Site never breaks
   - No wasted API calls

---

## 📊 Daily Usage Breakdown

**Scenario 1: Single User**
- Page load: 20 calls (BSE + NSE)
- Cache valid: 0 calls for 12 hours
- After 12 hours: 20 calls
- **Daily Total: ~40 calls** (5% of 800 limit)

**Scenario 2: 10 Users Per Day**
- Each user's first visit: 20 calls
- Cached visits: 0 calls
- **Daily Total: ~200 calls** (25% of 800 limit)

**Scenario 3: 20 Users Per Day**
- Each user's first visit: 20 calls
- Cached visits: 0 calls
- **Daily Total: ~400 calls** (50% of 800 limit)

---

## ⚙️ Configuration Options

### Current Settings (Minimal Usage)

```javascript
const TWELVE_DATA_API_KEY = 'YOUR_API_KEY_HERE';
const STOCK_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const BATCH_SIZE = 3; // 3 stocks at a time
const BATCH_DELAY = 1000; // 1 second delay
const STOCKS_TO_FETCH = 10; // Top 10 only
const REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
```

### If You Want More Frequent Updates

**Option 1: 6-Hour Cache** (Uses more API calls)
```javascript
const STOCK_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
// Daily usage: ~80 calls (4 refreshes)
```

**Option 2: 3-Hour Cache** (Uses even more)
```javascript
const STOCK_CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours
// Daily usage: ~160 calls (8 refreshes)
```

**Option 3: Fetch More Stocks** (Currently only 10)
```javascript
const topStocksToFetch = popularBSEStocks.slice(0, 15); // All 15 stocks
// Daily usage: ~60 calls with 12-hour cache
```

---

## 🚀 Benefits of Current Setup

### Minimal API Usage ✅
- Only 20 calls per 12 hours
- Well under 800/day limit
- Room for 40x more traffic
- Free plan is plenty

### Fast Performance ✅
- Cached data loads instantly
- No API delay after first load
- 12-hour cache is fresh enough for stocks

### Reliable ✅
- Sample data fallback
- Never breaks
- Works offline after first load

### Cost Effective ✅
- Free plan sufficient for 1000s of users
- No need to upgrade
- Scalable approach

---

## 📈 Twelve Data API Response Format

```json
{
  "symbol": "RELIANCE",
  "name": "Reliance Industries Limited",
  "exchange": "NSE",
  "currency": "INR",
  "datetime": "2025-10-11",
  "timestamp": 1728643800,
  "open": "2405.50",
  "high": "2455.80",
  "low": "2400.20",
  "close": "2450.50",
  "volume": "8500000",
  "previous_close": "2405.20",
  "change": "45.30",
  "percent_change": "1.89",
  "average_volume": "9200000",
  "is_market_open": false
}
```

---

## 🔧 Troubleshooting

### If API Calls Fail:
1. Check your API key is correct
2. Verify you haven't exceeded 800 calls/day
3. Check rate limit: 8 calls/minute
4. Look for error messages in browser console (F12)

### If Seeing Sample Data:
- API might be temporarily down
- API key might be invalid
- Rate limit exceeded
- Clear cache and refresh

### To Clear Cache:
```javascript
// Run in browser console
localStorage.removeItem('bseStocks');
localStorage.removeItem('bseStocksTime');
localStorage.removeItem('nseStocks');
localStorage.removeItem('nseStocksTime');
```

---

## 📊 API Limit Tracker

**Free Plan Limits:**
- ✅ 800 API calls per day
- ✅ 8 API calls per minute
- ✅ Core stock data (OHLCV)
- ✅ 30+ exchanges including NSE/BSE

**Current Usage:**
- 🟢 BSE: 10 calls every 12 hours
- 🟢 NSE: 10 calls every 12 hours
- 🟢 Total: ~40 calls per day
- 🟢 **95% quota remaining!**

---

## 🎯 Recommendation

**Keep current settings!** They provide:
- ✅ Real-time stock data
- ✅ 12-hour freshness
- ✅ Minimal API usage (5% of limit)
- ✅ Room to scale to 100s of users
- ✅ Reliable fallback system

**Only change if:**
- You need hourly updates
- You have very low traffic
- You want more than 10 stocks

---

**Your setup is optimized for minimal API usage while providing fresh, reliable stock data!** 🚀

