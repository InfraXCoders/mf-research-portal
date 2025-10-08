// API Configuration for Mutual Fund Data
// This file contains configuration for various Indian mutual fund data APIs

const API_CONFIG = {
    // RapidAPI - MF API (Popular choice for Indian mutual funds)
    rapidapi: {
        baseUrl: 'https://latest-mutual-fund-nav.p.rapidapi.com',
        headers: {
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Get from: https://rapidapi.com/
            'X-RapidAPI-Host': 'latest-mutual-fund-nav.p.rapidapi.com'
        },
        endpoints: {
            allSchemes: '/fetchAllSchemes',
            schemeDetails: '/fetchSchemeDetails',
            nav: '/fetchNav'
        }
    },

    // MFApi.in - Free API for Indian Mutual Funds
    mfapi: {
        baseUrl: 'https://api.mfapi.in',
        endpoints: {
            allSchemes: '/mf',
            schemeDetails: '/mf/{schemeCode}',
            latest: '/mf/{schemeCode}/latest'
        }
    },

    // AMFI India - Official data source
    amfi: {
        baseUrl: 'https://www.amfiindia.com/spages',
        endpoints: {
            navAll: '/NAVAll.txt'
        }
    },

    // BSE Star MF API (Requires registration)
    bsestarmf: {
        baseUrl: 'https://bsestarmf.in/RptSchemeDetail.aspx',
        note: 'Requires BSE Star MF registration and credentials'
    },

    // Zerodha Coin API (Unofficial)
    zerodha: {
        baseUrl: 'https://coin.zerodha.com/api',
        note: 'Unofficial API - may require authentication'
    }
};

// Cache configuration
const CACHE_CONFIG = {
    navDataTTL: 3600000,      // 1 hour for NAV data
    schemeListTTL: 86400000,  // 24 hours for scheme list
    performanceTTL: 3600000   // 1 hour for performance data
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, CACHE_CONFIG, RATE_LIMIT_CONFIG };
}
