// Mutual Fund API Service
// Handles all API calls, caching, and rate limiting

class MutualFundAPIService {
    constructor() {
        this.cache = new Map();
        this.requestLog = [];
        this.initialized = false;
    }

    // Initialize the service
    async initialize() {
        console.log('🚀 Initializing Mutual Fund API Service...');
        this.initialized = true;
        return this;
    }

    // ==================== MFApi.in Integration (FREE) ====================
    
    /**
     * Fetch all mutual fund schemes
     * Uses: https://api.mfapi.in/mf
     */
    async getAllSchemes() {
        const cacheKey = 'all_schemes';
        
        // Check cache first
        if (this.isCached(cacheKey, CACHE_CONFIG.schemeListTTL)) {
            console.log('📦 Returning cached schemes data');
            return this.getFromCache(cacheKey);
        }

        try {
            console.log('🌐 Fetching all schemes from MFApi...');
            const response = await fetch('https://api.mfapi.in/mf');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Transform data to our format
            const schemes = data.map(scheme => ({
                schemeCode: scheme.schemeCode,
                schemeName: scheme.schemeName,
                // Extract AMC name from scheme name
                amc: this.extractAMC(scheme.schemeName)
            }));
            
            this.setCache(cacheKey, schemes);
            console.log(`✅ Fetched ${schemes.length} schemes`);
            
            return schemes;
        } catch (error) {
            console.error('❌ Error fetching schemes:', error);
            return this.getFallbackData('schemes');
        }
    }

    /**
     * Fetch specific scheme details with NAV history
     * @param {string} schemeCode - Scheme code (e.g., "119551")
     */
    async getSchemeDetails(schemeCode) {
        const cacheKey = `scheme_${schemeCode}`;
        
        // Check cache
        if (this.isCached(cacheKey, CACHE_CONFIG.navDataTTL)) {
            console.log(`📦 Returning cached data for scheme ${schemeCode}`);
            return this.getFromCache(cacheKey);
        }

        try {
            console.log(`🌐 Fetching scheme details for ${schemeCode}...`);
            const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Calculate returns
            const calculatedData = this.calculateReturns(data);
            
            this.setCache(cacheKey, calculatedData);
            console.log(`✅ Fetched details for ${data.meta.scheme_name}`);
            
            return calculatedData;
        } catch (error) {
            console.error(`❌ Error fetching scheme ${schemeCode}:`, error);
            return null;
        }
    }

    /**
     * Fetch latest NAV for a scheme
     * @param {string} schemeCode - Scheme code
     */
    async getLatestNAV(schemeCode) {
        try {
            const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                nav: parseFloat(data.data[0].nav),
                date: data.data[0].date
            };
        } catch (error) {
            console.error(`❌ Error fetching latest NAV:`, error);
            return null;
        }
    }

    // ==================== RapidAPI Integration ====================
    
    /**
     * Fetch data from RapidAPI (requires API key)
     * @param {string} apiKey - Your RapidAPI key
     */
    async fetchFromRapidAPI(apiKey, endpoint) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'latest-mutual-fund-nav.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(
                `https://latest-mutual-fund-nav.p.rapidapi.com${endpoint}`,
                options
            );
            
            if (!response.ok) {
                throw new Error(`RapidAPI error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('❌ RapidAPI Error:', error);
            return null;
        }
    }

    // ==================== AMFI Data Integration ====================
    
    /**
     * Parse AMFI NAV data (txt format)
     */
    async fetchAMFIData() {
        try {
            console.log('🌐 Fetching AMFI data...');
            const response = await fetch('https://www.amfiindia.com/spages/NAVAll.txt');
            
            if (!response.ok) {
                throw new Error(`AMFI error! status: ${response.status}`);
            }
            
            const text = await response.text();
            const parsed = this.parseAMFIData(text);
            
            console.log(`✅ Parsed ${parsed.length} schemes from AMFI`);
            return parsed;
        } catch (error) {
            console.error('❌ Error fetching AMFI data:', error);
            return [];
        }
    }

    /**
     * Parse AMFI text format to JSON
     */
    parseAMFIData(text) {
        const lines = text.split('\n');
        const schemes = [];
        let currentAMC = '';

        for (const line of lines) {
            if (line.trim() === '' || line.includes('Scheme Code')) continue;
            
            // Check if line is AMC header
            if (!line.match(/^\d/)) {
                currentAMC = line.trim();
                continue;
            }

            const parts = line.split(';');
            if (parts.length >= 5) {
                schemes.push({
                    schemeCode: parts[0].trim(),
                    isinDivPayout: parts[1].trim(),
                    isinDivReinvest: parts[2].trim(),
                    schemeName: parts[3].trim(),
                    nav: parseFloat(parts[4].trim()),
                    date: parts[5]?.trim() || '',
                    amc: currentAMC
                });
            }
        }

        return schemes;
    }

    // ==================== Data Calculation & Analysis ====================
    
    /**
     * Calculate returns from NAV history
     */
    calculateReturns(schemeData) {
        const navHistory = schemeData.data || [];
        
        if (navHistory.length === 0) {
            return { ...schemeData, returns: {} };
        }

        const latestNav = parseFloat(navHistory[0].nav);
        
        // Calculate returns for different periods
        const returns = {
            oneYear: this.calculatePeriodReturn(navHistory, 365, latestNav),
            twoYear: this.calculatePeriodReturn(navHistory, 730, latestNav),
            threeYear: this.calculatePeriodReturn(navHistory, 1095, latestNav),
            fiveYear: this.calculatePeriodReturn(navHistory, 1825, latestNav)
        };

        return {
            ...schemeData,
            latestNav,
            returns,
            calculatedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate return for a specific period
     */
    calculatePeriodReturn(navHistory, days, latestNav) {
        if (navHistory.length < days) {
            return null;
        }

        const oldNav = parseFloat(navHistory[days - 1]?.nav || navHistory[navHistory.length - 1].nav);
        const years = days / 365;
        
        // Calculate CAGR
        const cagr = (Math.pow(latestNav / oldNav, 1 / years) - 1) * 100;
        
        return {
            value: cagr.toFixed(2),
            startNav: oldNav,
            endNav: latestNav,
            days
        };
    }

    /**
     * Calculate investment growth
     */
    calculateInvestmentGrowth(initialAmount, returnRate, years) {
        const rate = returnRate / 100;
        const finalAmount = initialAmount * Math.pow(1 + rate, years);
        
        return {
            invested: initialAmount,
            current: finalAmount,
            gain: finalAmount - initialAmount,
            gainPercent: ((finalAmount - initialAmount) / initialAmount) * 100
        };
    }

    /**
     * Calculate SIP returns
     */
    calculateSIPReturns(monthlyAmount, returnRate, years) {
        const months = years * 12;
        const monthlyRate = returnRate / 12 / 100;
        
        let totalInvested = 0;
        let futureValue = 0;
        
        for (let i = 0; i < months; i++) {
            totalInvested += monthlyAmount;
            futureValue += monthlyAmount * Math.pow(1 + monthlyRate, months - i);
        }
        
        return {
            invested: totalInvested,
            current: futureValue,
            gain: futureValue - totalInvested,
            gainPercent: ((futureValue - totalInvested) / totalInvested) * 100
        };
    }

    // ==================== Utility Functions ====================
    
    /**
     * Extract AMC name from scheme name
     */
    extractAMC(schemeName) {
        const amcPatterns = {
            'HDFC': 'HDFC Mutual Fund',
            'ICICI': 'ICICI Prudential Mutual Fund',
            'SBI': 'SBI Mutual Fund',
            'Axis': 'Axis Mutual Fund',
            'Kotak': 'Kotak Mahindra Mutual Fund',
            'Aditya Birla': 'Aditya Birla Sun Life Mutual Fund',
            'UTI': 'UTI Mutual Fund',
            'DSP': 'DSP Mutual Fund',
            'Nippon': 'Nippon India Mutual Fund',
            'Franklin': 'Franklin Templeton Mutual Fund',
            'Quant': 'Quant Mutual Fund',
            'HSBC': 'HSBC Mutual Fund',
            'Tata': 'Tata Mutual Fund',
            'Mirae': 'Mirae Asset Mutual Fund'
        };

        for (const [key, value] of Object.entries(amcPatterns)) {
            if (schemeName.includes(key)) {
                return value;
            }
        }

        return 'Other';
    }

    /**
     * Categorize scheme by type
     */
    categorizeScheme(schemeName) {
        const name = schemeName.toLowerCase();
        
        if (name.includes('small cap')) return 'small-cap';
        if (name.includes('mid cap')) return 'mid-cap';
        if (name.includes('large cap')) return 'large-cap';
        if (name.includes('flexi cap')) return 'flexi-cap';
        if (name.includes('multi cap')) return 'multi-cap';
        if (name.includes('elss')) return 'elss';
        if (name.includes('debt') || name.includes('bond')) return 'debt';
        if (name.includes('hybrid')) return 'hybrid';
        if (name.includes('liquid')) return 'liquid';
        
        return 'other';
    }

    // ==================== Cache Management ====================
    
    isCached(key, ttl) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        
        const age = Date.now() - cached.timestamp;
        return age < ttl;
    }

    getFromCache(key) {
        return this.cache.get(key)?.data || null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // ==================== Rate Limiting ====================
    
    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Clean old requests
        this.requestLog = this.requestLog.filter(time => time > oneMinuteAgo);
        
        // Check limit
        if (this.requestLog.length >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
            console.warn('⚠️ Rate limit reached');
            return false;
        }
        
        this.requestLog.push(now);
        return true;
    }

    // ==================== Fallback Data ====================
    
    getFallbackData(type) {
        console.log('📂 Using fallback data');
        
        if (type === 'schemes') {
            return [
                { schemeCode: '119551', schemeName: 'Nippon India Small Cap Fund - Growth', amc: 'Nippon India' },
                { schemeCode: '120503', schemeName: 'HDFC Small Cap Fund - Growth', amc: 'HDFC' },
                { schemeCode: '112090', schemeName: 'SBI Small Cap Fund - Regular Plan - Growth', amc: 'SBI' }
            ];
        }
        
        return null;
    }
}

// Create singleton instance
const apiService = new MutualFundAPIService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = apiService;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.MFApiService = apiService;
}
