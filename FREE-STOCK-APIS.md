# Free Stock Market APIs for India (NSE/BSE)

**Similar to mfapi.in for Mutual Funds**

---

## 🎯 Best Options for Indian Stocks

### 1. ✅ **Yahoo Finance (Unofficial) - RECOMMENDED**
**Best for: Real-time stock data without API key**

```javascript
// Example: Fetch Reliance Industries (RELIANCE.NS)
const symbol = 'RELIANCE.NS'; // .NS for NSE, .BO for BSE
const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;

// Get stock quote
const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
```

**Features:**
- ✅ No API key required
- ✅ Real-time data (15-20 min delay)
- ✅ Historical data available
- ✅ Supports NSE (.NS) and BSE (.BO)
- ✅ JSON response format
- ✅ Unlimited requests (no official limit)
- ⚠️ Unofficial API (Yahoo can change it anytime)

**Popular Indian Stock Symbols:**
- Reliance: `RELIANCE.NS`
- TCS: `TCS.NS`
- Infosys: `INFY.NS`
- HDFC Bank: `HDFCBANK.NS`
- Nifty 50: `^NSEI`
- Sensex: `^BSESN`

---

### 2. ✅ **Alpha Vantage - Good Free Tier**
**Best for: Detailed analysis with API key**

```javascript
// Get API Key: https://www.alphavantage.co/support/#api-key
const API_KEY = 'YOUR_FREE_API_KEY';
const symbol = 'RELIANCE.BSE'; // BSE stocks
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
```

**Features:**
- ✅ Free API key
- ✅ 25 API calls per day (free tier)
- ✅ 5 API calls per minute
- ✅ Historical data up to 20 years
- ✅ Technical indicators (RSI, MACD, etc.)
- ✅ Global stocks including India
- ⚠️ Limited free tier

**Get Free Key:** https://www.alphavantage.co/support/#api-key

---

### 3. ✅ **Twelve Data - Generous Free Tier**
**Best for: Multiple stocks with free API**

```javascript
// Get API Key: https://twelvedata.com/pricing
const API_KEY = 'YOUR_FREE_API_KEY';
const symbol = 'RELIANCE';
const exchange = 'NSE';
const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&exchange=${exchange}&interval=1day&apikey=${API_KEY}`;
```

**Features:**
- ✅ Free API key
- ✅ 800 API calls per day
- ✅ 8 calls per minute
- ✅ Real-time and historical data
- ✅ Supports NSE/BSE
- ✅ Technical indicators included
- ✅ Good documentation

**Get Free Key:** https://twelvedata.com/pricing

---

### 4. ✅ **NSE India Official (Web Scraping Alternative)**
**Best for: Latest official NSE data**

```javascript
// Direct NSE API (no key needed, but might need CORS proxy)
const symbol = 'RELIANCE';
const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;

// Market status
const statusUrl = 'https://www.nseindia.com/api/marketStatus';

// Top gainers
const gainersUrl = 'https://www.nseindia.com/api/live-analysis-variations?index=gainers';
```

**Features:**
- ✅ Official NSE data
- ✅ No API key needed
- ✅ Real-time data
- ✅ Free to use
- ⚠️ Requires proper headers
- ⚠️ May need CORS proxy for browser

**Required Headers:**
```javascript
headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9'
}
```

---

### 5. ⚠️ **IEX Cloud - Limited Free Tier**
**Best for: US stocks (limited India coverage)**

```javascript
const API_KEY = 'YOUR_API_KEY';
const symbol = 'INFY'; // Infosys ADR (US listing)
const url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${API_KEY}`;
```

**Features:**
- ✅ Free tier available
- ✅ 50,000 messages per month
- ⚠️ Limited Indian stocks (only ADRs)
- ⚠️ Better for US stocks

---

## 📊 Comparison Table

| API | Free | API Key | Indian Stocks | Rate Limit | Real-time | Best For |
|-----|------|---------|---------------|------------|-----------|----------|
| **Yahoo Finance** | ✅ Yes | ❌ No | ✅ Yes (NSE/BSE) | Unlimited | ~15 min delay | **Best Overall** |
| **Alpha Vantage** | ✅ Yes | ✅ Required | ✅ Yes | 25/day | ❌ No | Analysis with key |
| **Twelve Data** | ✅ Yes | ✅ Required | ✅ Yes | 800/day | ✅ Yes | Multiple stocks |
| **NSE Official** | ✅ Yes | ❌ No | ✅ Yes (NSE only) | High | ✅ Yes | Official data |
| **IEX Cloud** | ⚠️ Limited | ✅ Required | ⚠️ ADRs only | 50k/month | ✅ Yes | US stocks mainly |

---

## 🏆 **Recommended Choice: Yahoo Finance**

**Why Yahoo Finance is like mfapi.in for stocks:**

1. ✅ **No API Key** - Just like mfapi.in
2. ✅ **No Rate Limits** - Unlimited requests
3. ✅ **JSON Format** - Easy to parse
4. ✅ **NSE & BSE** - Full Indian market coverage
5. ✅ **Historical Data** - Years of data available
6. ✅ **Free Forever** - No paid tiers
7. ✅ **Easy Integration** - Simple REST calls

---

## 💻 Example Implementation

### Yahoo Finance - Stock Quote

```javascript
// Fetch stock data (similar to mfapi.in)
async function getStockData(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.quoteResponse && data.quoteResponse.result.length > 0) {
            const stock = data.quoteResponse.result[0];
            return {
                symbol: stock.symbol,
                name: stock.shortName || stock.longName,
                price: stock.regularMarketPrice,
                change: stock.regularMarketChange,
                changePercent: stock.regularMarketChangePercent,
                volume: stock.regularMarketVolume,
                marketCap: stock.marketCap,
                dayHigh: stock.regularMarketDayHigh,
                dayLow: stock.regularMarketDayLow,
                fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
                pe: stock.trailingPE,
                eps: stock.epsTrailingTwelveMonths
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
    }
}

// Usage
const relianceData = await getStockData('RELIANCE.NS');
console.log(relianceData);
```

### Yahoo Finance - Historical Data

```javascript
async function getStockHistory(symbol, range = '1mo', interval = '1d') {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.chart && data.chart.result.length > 0) {
            const result = data.chart.result[0];
            const timestamps = result.timestamp;
            const quotes = result.indicators.quote[0];
            
            return timestamps.map((time, index) => ({
                date: new Date(time * 1000),
                open: quotes.open[index],
                high: quotes.high[index],
                low: quotes.low[index],
                close: quotes.close[index],
                volume: quotes.volume[index]
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
}

// Usage
const history = await getStockHistory('RELIANCE.NS', '1mo', '1d');
console.log(history);
```

### NSE Official API

```javascript
async function getNSEStockData(symbol) {
    try {
        // Note: May need CORS proxy in browser
        const url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching NSE data:', error);
        return null;
    }
}

// Get top gainers
async function getTopGainers() {
    const url = 'https://www.nseindia.com/api/live-analysis-variations?index=gainers';
    const response = await fetch(url);
    return await response.json();
}
```

---

## 🚀 Implementation Plan for Your Portal

### Option 1: Add Stock Comparison (Similar to MF Comparison)

```html
<!-- Stock Comparison Section -->
<section id="stock-comparison" class="section">
    <div class="container">
        <h2>Compare Stocks</h2>
        <div class="stock-inputs">
            <input type="text" placeholder="Search NSE/BSE stocks..." id="stock1">
            <input type="text" placeholder="Search NSE/BSE stocks..." id="stock2">
            <input type="text" placeholder="Search NSE/BSE stocks..." id="stock3">
        </div>
        <button onclick="compareStocks()">Compare Stocks</button>
        <div id="stockComparisonResults"></div>
    </div>
</section>
```

### Option 2: Add Top Performers Section

```html
<!-- Top Performing Stocks -->
<section id="top-stocks" class="section">
    <div class="container">
        <h2>Top Performing Stocks</h2>
        <div class="tabs">
            <button onclick="loadTopStocks('gainers')">Top Gainers</button>
            <button onclick="loadTopStocks('losers')">Top Losers</button>
            <button onclick="loadTopStocks('volume')">Most Active</button>
        </div>
        <div id="topStocksTable"></div>
    </div>
</section>
```

### Option 3: Add Stock Calculator

```html
<!-- Stock Investment Calculator -->
<section id="stock-calculator" class="section">
    <div class="container">
        <h2>Stock Returns Calculator</h2>
        <input type="text" placeholder="Stock Symbol (e.g., RELIANCE.NS)">
        <input type="number" placeholder="Investment Amount">
        <input type="date" placeholder="Purchase Date">
        <button onclick="calculateStockReturns()">Calculate Returns</button>
        <div id="stockReturnsResult"></div>
    </div>
</section>
```

---

## ⚠️ Important Notes

1. **Yahoo Finance API is unofficial** - While widely used, it's not officially supported by Yahoo and could change without notice.

2. **CORS Issues** - Browser-based requests to some APIs (like NSE) may face CORS restrictions. Solutions:
   - Use a CORS proxy (e.g., `https://corsproxy.io/?`)
   - Create a simple backend proxy
   - Use browser extensions for development

3. **Rate Limiting** - Even though Yahoo Finance doesn't have official limits, be respectful:
   - Cache responses
   - Implement debouncing
   - Don't make excessive requests

4. **Data Accuracy** - Yahoo Finance typically has 15-20 minute delays for free tier
   - Good for research and comparison
   - Not suitable for active trading

5. **Backup Plans** - Consider having fallback APIs:
   - Primary: Yahoo Finance
   - Backup: Twelve Data
   - Emergency: NSE Official

---

## 🔗 Useful Links

- **Yahoo Finance Unofficial Docs**: https://github.com/ranaroussi/yfinance
- **Alpha Vantage**: https://www.alphavantage.co/
- **Twelve Data**: https://twelvedata.com/
- **NSE India**: https://www.nseindia.com/
- **BSE India**: https://www.bseindia.com/

---

## 📈 Feature Comparison: MF vs Stocks

| Feature | Mutual Funds (mfapi.in) | Stocks (Yahoo Finance) |
|---------|------------------------|------------------------|
| Free API | ✅ Yes | ✅ Yes |
| API Key | ❌ Not needed | ❌ Not needed |
| Real-time | ❌ Daily NAV | ⚠️ 15-min delay |
| Historical | ✅ Full history | ✅ Full history |
| Indian Market | ✅ AMFI data | ✅ NSE/BSE |
| JSON Format | ✅ Yes | ✅ Yes |
| Update Frequency | Daily (after 11 PM) | Every 15-20 minutes |
| Official | ✅ Yes | ⚠️ Unofficial |

---

## 💡 Recommendation

**For your Financial Safar, I recommend:**

1. **Start with Yahoo Finance API** - It's the closest equivalent to mfapi.in for stocks
2. **Add stock comparison feature** similar to your current MF comparison
3. **Cache aggressively** to reduce API calls
4. **Display disclaimers** about 15-20 minute data delays
5. **Have NSE Official as backup** for critical data

**Implementation Priority:**
1. ✅ Stock search and comparison (like MF comparison)
2. ✅ Top gainers/losers section
3. ✅ Stock vs MF comparison calculator
4. ⚠️ Portfolio tracker (requires user accounts)

---

**Note:** Since you already have a great UI for mutual funds with mfapi.in, adding stocks with Yahoo Finance will maintain the same free, no-authentication experience for your users! 🚀

