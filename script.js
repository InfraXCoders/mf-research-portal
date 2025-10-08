// Sample mutual fund data
const mutualFundData = [
    {
        schemeName: "Nippon India Small Cap Fund - Growth Plan - Growth Option",
        amc: "Nippon India Mutual Fund",
        aum: 64828,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 6546054.06,
        annualReturn: 20.65,
        category: "small-cap"
    },
    {
        schemeName: "Quant Small Cap Fund - Growth - Regular Plan",
        amc: "Quant Mutual Fund",
        aum: 28880,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 5892083.36,
        annualReturn: 19.39,
        category: "small-cap"
    },
    {
        schemeName: "HDFC Small Cap Fund - Growth Option",
        amc: "HDFC Mutual Fund",
        aum: 36284,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 5447559.44,
        annualReturn: 18.46,
        category: "small-cap"
    },
    {
        schemeName: "SBI Small Cap Fund - Regular Plan - Growth",
        amc: "SBI Mutual Fund",
        aum: 35250,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 5418532.18,
        annualReturn: 18.39,
        category: "small-cap"
    },
    {
        schemeName: "HSBC Small Cap Fund - Regular Growth",
        amc: "HSBC Mutual Fund",
        aum: 15886,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 5375903.45,
        annualReturn: 18.3,
        category: "small-cap"
    },
    {
        schemeName: "Axis Small Cap Fund - Regular Plan - Growth",
        amc: "Axis Mutual Fund",
        aum: 25658,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 5353861.69,
        annualReturn: 18.25,
        category: "small-cap"
    },
    {
        schemeName: "Kotak Small Cap Fund - Growth",
        amc: "Kotak Mahindra Mutual Fund",
        aum: 17508,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 4857711.66,
        annualReturn: 17.11,
        category: "small-cap"
    },
    {
        schemeName: "DSP Small Cap Fund - Regular Plan - Growth",
        amc: "DSP Mutual Fund",
        aum: 16626,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 4561181.03,
        annualReturn: 16.37,
        category: "small-cap"
    },
    {
        schemeName: "ICICI Prudential Small Cap Fund - Growth",
        amc: "ICICI Prudential Mutual Fund",
        aum: 8443,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 4419939.58,
        annualReturn: 16.01,
        category: "small-cap"
    },
    {
        schemeName: "Franklin India Small Cap Fund - Growth",
        amc: "Franklin Templeton Mutual Fund",
        aum: 13302,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 4273150.43,
        annualReturn: 15.62,
        category: "small-cap"
    },
    {
        schemeName: "Union Small Cap Fund - Regular Plan - Growth",
        amc: "Union Mutual Fund",
        aum: 1658,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 4061324.61,
        annualReturn: 15.03,
        category: "small-cap"
    },
    {
        schemeName: "Sundaram Small Cap Fund - Regular Plan - Growth",
        amc: "Sundaram Mutual Fund",
        aum: 3283,
        from: "06-10-2015",
        to: "06-10-2025",
        investedAmount: 1000000,
        currentValue: 3722886.76,
        annualReturn: 14.04,
        category: "small-cap"
    }
];

// DOM Elements (will be null if elements don't exist, which is fine)
let analyzeBtn, resetBtn, resultsTableBody, resultsSection, amcSelect, categorySelect, periodSelect, amountSelect;

// Get DOM elements after page loads
function getDOMElements() {
    analyzeBtn = document.getElementById('analyzeBtn');
    resetBtn = document.getElementById('resetBtn');
    resultsTableBody = document.getElementById('resultsTableBody');
    resultsSection = document.getElementById('results');
    amcSelect = document.getElementById('amc');
    categorySelect = document.getElementById('category');
    periodSelect = document.getElementById('period');
    amountSelect = document.getElementById('amount');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    console.log('🚀 Initializing MF Research Portal...');
    
    // Get DOM elements first
    getDOMElements();
    
    // Initialize API Service
    if (window.MFApiService) {
        await window.MFApiService.initialize();
        console.log('✅ API Service initialized');
        
        // Try to load real-time data
        await loadRealTimeData();
    } else {
        console.warn('⚠️ API Service not available, using sample data');
    }
    
    // Add event listeners (only if elements exist)
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', handleAnalyze);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    // Initialize search functionality
    initializeSearch();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Add scroll effect to header
    window.addEventListener('scroll', handleScroll);
    
    // Initialize results section with helpful message
    const resultsTableBody = document.getElementById('resultsTableBody');
    if (resultsTableBody) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: var(--primary-color);"></i>
                    <p style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">Ready to analyze mutual funds!</p>
                    <p>Use the search bar above or select filters and click "Analyze Funds" to see results</p>
                </td>
            </tr>
        `;
    }
    
    console.log('✅ Application initialized');
}

// Load real-time data from API
async function loadRealTimeData() {
    try {
        console.log('📡 Loading real-time mutual fund data...');
        
        // Show loading indicator
        showGlobalLoading(true);
        
        // Fetch all schemes from MFApi.in
        const schemes = await window.MFApiService.getAllSchemes();
        
        if (schemes && schemes.length > 0) {
            console.log(`✅ Loaded ${schemes.length} schemes from API`);
            
            // Update AMC dropdown with real data
            updateAMCDropdown(schemes);
            
            // Store for later use
            window.realTimeSchemes = schemes;
        }
        
        // Load specific scheme details for popular funds
        const popularSchemeCodes = ['119551', '120503', '112090', '118989'];
        const detailedSchemes = [];
        
        for (const code of popularSchemeCodes) {
            const details = await window.MFApiService.getSchemeDetails(code);
            if (details) {
                detailedSchemes.push(details);
            }
        }
        
        if (detailedSchemes.length > 0) {
            console.log(`✅ Loaded ${detailedSchemes.length} detailed schemes`);
            window.realTimeDetailedData = detailedSchemes;
        }
        
        showGlobalLoading(false);
        showNotification('Real-time data loaded successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error loading real-time data:', error);
        showGlobalLoading(false);
        showNotification('Using sample data. Real-time data unavailable.', 'info');
    }
}

// Update AMC dropdown with real data
function updateAMCDropdown(schemes) {
    const amcSelect = document.getElementById('amc');
    if (!amcSelect) return;
    
    // Get unique AMCs
    const amcs = [...new Set(schemes.map(s => s.amc))].filter(amc => amc && amc !== 'Other');
    amcs.sort();
    
    // Clear all existing options
    amcSelect.innerHTML = '';
    
    // Add "All AMCs" option first
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All AMCs';
    amcSelect.appendChild(allOption);
    
    // Add real AMCs
    amcs.forEach(amc => {
        const option = document.createElement('option');
        // Use the AMC name as value for better filtering
        option.value = amc;
        option.textContent = amc;
        amcSelect.appendChild(option);
    });
    
    console.log(`✅ Updated AMC dropdown with ${amcs.length} AMCs`);
}

// Show global loading indicator
function showGlobalLoading(show) {
    let loader = document.getElementById('global-loader');
    
    if (show && !loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(37, 99, 235, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading real-time data...';
        document.body.appendChild(loader);
    } else if (!show && loader) {
        loader.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

async function handleAnalyze() {
    // Show loading state
    analyzeBtn.classList.add('loading');
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    try {
        // Get all schemes from API
        const allSchemes = window.realTimeSchemes || [];
        
        if (allSchemes.length === 0) {
            showNotification('Loading data... Please wait and try again.', 'warning');
            analyzeBtn.classList.remove('loading');
            analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Funds';
            return;
        }
        
        // Get selected filters
        const selectedAMC = amcSelect.value;
        const selectedCategory = categorySelect.value;
        const selectedPeriod = periodSelect.value;
        const selectedAmount = parseInt(amountSelect.value);
        
        // Filter schemes
        let filteredSchemes = allSchemes;
        
        // Filter by AMC
        if (selectedAMC && selectedAMC !== '') {
            filteredSchemes = filteredSchemes.filter(scheme => 
                scheme.amc.toLowerCase().includes(selectedAMC.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategory && selectedCategory !== '') {
            filteredSchemes = filteredSchemes.filter(scheme => 
                scheme.schemeName.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }
        
        // Limit to top 20 results for performance
        filteredSchemes = filteredSchemes.slice(0, 20);
        
        // Load detailed data for filtered schemes (limited to first 10 for API limits)
        const detailedSchemes = [];
        for (const scheme of filteredSchemes.slice(0, 10)) {
            try {
                const details = await window.MFApiService.getSchemeDetails(scheme.schemeCode);
                if (details) {
                    detailedSchemes.push({
                        ...scheme,
                        details: details,
                        nav: details.latestNav,
                        returns: details.returns
                    });
                }
            } catch (error) {
                console.error(`Error loading ${scheme.schemeName}:`, error);
            }
        }
        
        // Display results
        if (detailedSchemes.length > 0) {
            displayAnalysisResults(detailedSchemes, selectedAmount);
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            showNotification(`Found ${detailedSchemes.length} matching funds!`, 'success');
        } else {
            showNotification('No funds found matching your criteria. Try different filters.', 'warning');
        }
        
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification('Error analyzing funds. Please try again.', 'error');
    }
    
    // Reset button state
    analyzeBtn.classList.remove('loading');
    analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Funds';
}

function displayAnalysisResults(schemes, investmentAmount) {
    const resultsTableBody = document.getElementById('resultsTableBody');
    
    if (!resultsTableBody || schemes.length === 0) return;
    
    // Clear existing results
    resultsTableBody.innerHTML = '';
    
    // Sort by returns (if available)
    schemes.sort((a, b) => {
        const returnA = parseFloat(a.returns?.oneYear?.value || 0);
        const returnB = parseFloat(b.returns?.oneYear?.value || 0);
        return returnB - returnA;
    });
    
    // Display each scheme
    schemes.forEach(scheme => {
        const nav = scheme.nav || 'N/A';
        const oneYearReturn = scheme.returns?.oneYear?.value || 'N/A';
        const currentValue = oneYearReturn !== 'N/A' ? 
            (investmentAmount * (1 + parseFloat(oneYearReturn) / 100)).toFixed(2) : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <a href="#" class="scheme-name" onclick="event.preventDefault(); viewDetails('${escapeHtml(scheme.schemeName)}')">
                    ${scheme.schemeName}
                </a>
            </td>
            <td>${scheme.details?.meta?.fund_house || scheme.amc || 'N/A'}</td>
            <td>N/A</td>
            <td>Latest</td>
            <td>₹${formatNumber(investmentAmount)}</td>
            <td>₹${nav !== 'N/A' ? nav : 'N/A'}</td>
            <td class="${oneYearReturn !== 'N/A' && parseFloat(oneYearReturn) >= 0 ? 'return-positive' : 'return-negative'}">
                ${oneYearReturn}${oneYearReturn !== 'N/A' ? '%' : ''}
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewDetails('${escapeHtml(scheme.schemeName)}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
    
    // Update metadata
    const resultsMeta = document.getElementById('resultsMeta');
    const resultsCount = document.getElementById('resultsCount');
    const resultsDate = document.getElementById('resultsDate');
    
    if (resultsMeta && resultsCount && resultsDate) {
        resultsMeta.style.display = 'flex';
        resultsCount.textContent = `Showing ${schemes.length} funds`;
        
        // Get current date
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).replace(/\//g, '-');
        resultsDate.textContent = `Data as on: ${formattedDate}`;
    }
    
    // Update summary
    const avgReturn = schemes.reduce((sum, s) => {
        const ret = parseFloat(s.returns?.oneYear?.value || 0);
        return sum + ret;
    }, 0) / schemes.length;
    
    const bestFund = schemes[0];
    
    const summaryElements = document.querySelectorAll('.summary-value');
    if (summaryElements.length >= 3) {
        summaryElements[0].textContent = `${avgReturn.toFixed(2)}%`;
        summaryElements[1].textContent = bestFund.schemeName.split(' ').slice(0, 3).join(' ');
        summaryElements[2].textContent = schemes.length.toString();
    }
}

function handleReset() {
    // Reset all form fields
    amcSelect.value = '';
    categorySelect.value = '';
    periodSelect.value = '1';
    amountSelect.value = '10000';
    
    // Hide metadata
    const resultsMeta = document.getElementById('resultsMeta');
    if (resultsMeta) {
        resultsMeta.style.display = 'none';
    }
    
    // Clear results
    const resultsTableBody = document.getElementById('resultsTableBody');
    if (resultsTableBody) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    Select filters and click "Analyze Funds" to see results
                </td>
            </tr>
        `;
    }
    
    showNotification('Filters reset successfully', 'success');
}

function filterData() {
    let filteredData = [...mutualFundData];
    
    // Filter by AMC
    const selectedAMC = amcSelect.value;
    if (selectedAMC) {
        filteredData = filteredData.filter(fund => 
            fund.amc.toLowerCase().includes(selectedAMC.toLowerCase())
        );
    }
    
    // Filter by category
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
        filteredData = filteredData.filter(fund => 
            fund.category === selectedCategory
        );
    }
    
    // Filter by period (simulate different returns based on period)
    const selectedPeriod = periodSelect.value;
    if (selectedPeriod !== 'inception') {
        filteredData = filteredData.map(fund => ({
            ...fund,
            annualReturn: calculatePeriodReturn(fund.annualReturn, selectedPeriod)
        }));
    }
    
    // Adjust amounts based on selected amount
    const selectedAmount = parseInt(amountSelect.value);
    filteredData = filteredData.map(fund => ({
        ...fund,
        investedAmount: selectedAmount,
        currentValue: calculateCurrentValue(selectedAmount, fund.annualReturn, selectedPeriod)
    }));
    
    return filteredData;
}

function calculatePeriodReturn(baseReturn, period) {
    // Simulate different returns for different periods
    const periodMultipliers = {
        '1': 0.8,
        '2': 0.85,
        '3': 0.9,
        '5': 0.95,
        '10': 1.0
    };
    
    return baseReturn * (periodMultipliers[period] || 1.0);
}

function calculateCurrentValue(investedAmount, annualReturn, period) {
    const years = period === 'inception' ? 10 : parseInt(period);
    const returnRate = annualReturn / 100;
    return investedAmount * Math.pow(1 + returnRate, years);
}

// Old displayResults function removed - now using displayAnalysisResults instead

function formatNumber(num) {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(1) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(1) + ' L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + ' K';
    }
    return num.toLocaleString();
}

async function viewDetails(schemeName) {
    console.log(`🔍 viewDetails called for: ${schemeName}`);
    console.log(`📊 Function type: ${typeof viewDetails}`);
    console.log(`🎯 This should show modal, not open URL`);
    
    // Show loading notification
    showNotification(`Loading details for ${schemeName}...`, 'info');
    
    try {
        // Get all schemes to find the scheme code
        const allSchemes = window.realTimeSchemes || [];
        
        // Find the scheme by name
        const scheme = allSchemes.find(s => 
            s.schemeName.toLowerCase().includes(schemeName.toLowerCase())
        );
        
        if (!scheme) {
            showNotification('Scheme not found. Please try searching for it.', 'error');
            return;
        }
        
        // Fetch detailed information
        const details = await window.MFApiService.getSchemeDetails(scheme.schemeCode);
        
        if (details) {
            // Create a modal or detailed view
            showSchemeDetailsModal(details);
            showNotification('Details loaded successfully!', 'success');
        }
    } catch (error) {
        console.error('Error loading scheme details:', error);
        showNotification('Error loading scheme details', 'error');
    }
}

function showSchemeDetailsModal(details) {
    console.log('🎨 Creating modal for scheme:', details.meta?.scheme_name);
    console.log('📊 Details object:', details);
    
    // Calculate CAGR since inception
    const navHistory = details.data || [];
    let cagrSinceInception = 'N/A';
    
    if (navHistory.length > 0) {
        const latestNav = parseFloat(navHistory[0].nav);
        const oldestNav = parseFloat(navHistory[navHistory.length - 1].nav);
        const years = navHistory.length / 365;
        
        if (years > 0 && oldestNav > 0) {
            cagrSinceInception = ((Math.pow(latestNav / oldestNav, 1 / years) - 1) * 100).toFixed(2);
        }
    }
    
    // Calculate NAV change
    let navChange = 'N/A';
    let navChangePercent = 'N/A';
    if (navHistory.length >= 2) {
        const latestNav = parseFloat(navHistory[0].nav);
        const previousNav = parseFloat(navHistory[1].nav);
        navChange = (latestNav - previousNav).toFixed(2);
        navChangePercent = ((navChange / previousNav) * 100).toFixed(4);
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="schemeModal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                
                <h2 class="modal-title">${details.meta.scheme_name}</h2>
                
                <div class="modal-info-grid">
                    <div class="info-item">
                        <span class="info-label">Category:</span>
                        <span class="info-value">${details.meta.scheme_category || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Asset Class:</span>
                        <span class="info-value">${details.meta.scheme_type || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fund House:</span>
                        <span class="info-value">${details.meta.fund_house || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Scheme Code:</span>
                        <span class="info-value">${details.meta.scheme_code || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="nav-highlight">
                    <div class="nav-main">
                        <span class="nav-label">NAV as on ${details.data?.[0]?.date || 'N/A'}</span>
                        <span class="nav-price">₹${details.latestNav || 'N/A'}</span>
                        <span class="nav-change ${parseFloat(navChange) >= 0 ? 'positive' : 'negative'}">
                            ${navChange !== 'N/A' ? (parseFloat(navChange) >= 0 ? '+' : '') + navChange : ''} 
                            ${navChangePercent !== 'N/A' ? '(' + navChangePercent + '%)' : ''}
                        </span>
                    </div>
                    <div class="cagr-box">
                        <span class="cagr-label">CAGR Since Inception</span>
                        <span class="cagr-value">${cagrSinceInception}%</span>
                    </div>
                </div>
                
                <div class="modal-stats">
                    <div class="stat-box">
                        <div class="stat-label">1 Year Return</div>
                        <div class="stat-value ${parseFloat(details.returns?.oneYear?.value || 0) >= 0 ? 'positive' : 'negative'}">
                            ${details.returns?.oneYear?.value || 'N/A'}${details.returns?.oneYear?.value ? '%' : ''}
                        </div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">2 Year Return</div>
                        <div class="stat-value ${parseFloat(details.returns?.twoYear?.value || 0) >= 0 ? 'positive' : 'negative'}">
                            ${details.returns?.twoYear?.value || 'N/A'}${details.returns?.twoYear?.value ? '%' : ''}
                        </div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">3 Year Return</div>
                        <div class="stat-value ${parseFloat(details.returns?.threeYear?.value || 0) >= 0 ? 'positive' : 'negative'}">
                            ${details.returns?.threeYear?.value || 'N/A'}${details.returns?.threeYear?.value ? '%' : ''}
                        </div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">5 Year Return</div>
                        <div class="stat-value ${parseFloat(details.returns?.fiveYear?.value || 0) >= 0 ? 'positive' : 'negative'}">
                            ${details.returns?.fiveYear?.value || 'N/A'}${details.returns?.fiveYear?.value ? '%' : ''}
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>
                        <i class="fas fa-chart-line"></i>
                        Performance Growth Chart
                    </h3>
                    <div class="growth-chart-container">
                        ${generateGrowthChart(navHistory)}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>
                        <i class="fas fa-history"></i>
                        NAV History (Last 30 Days)
                    </h3>
                    <div class="nav-history">
                        ${details.data?.slice(0, 30).map((item, index) => `
                            <div class="nav-item">
                                <span class="nav-date">${item.date}</span>
                                <span class="nav-value">₹${item.nav}</span>
                                ${index > 0 ? `<span class="nav-change-small ${parseFloat(item.nav) >= parseFloat(details.data[index-1].nav) ? 'positive' : 'negative'}">
                                    ${((parseFloat(item.nav) - parseFloat(details.data[index-1].nav)) / parseFloat(details.data[index-1].nav) * 100).toFixed(2)}%
                                </span>` : ''}
                            </div>
                        `).join('') || '<p style="text-align: center; color: var(--gray-500);">No history available</p>'}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>
                        <i class="fas fa-info-circle"></i>
                        Investment Information
                    </h3>
                    <div class="info-grid-detail">
                        <div class="info-detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <div class="detail-label">Data Updated</div>
                                <div class="detail-value">${details.data?.[0]?.date || 'N/A'}</div>
                            </div>
                        </div>
                        <div class="info-detail-item">
                            <i class="fas fa-database"></i>
                            <div>
                                <div class="detail-label">Total NAV Records</div>
                                <div class="detail-value">${navHistory.length.toLocaleString()} days</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeModal()">
                        <i class="fas fa-check"></i> Done
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function generateGrowthChart(navHistory) {
    if (!navHistory || navHistory.length === 0) {
        return '<p style="text-align: center; color: var(--gray-500);">Insufficient data for chart</p>';
    }
    
    const schemeId = 'chart_' + Date.now();
    
    // Store NAV history in a data attribute for JavaScript access
    const navDataJSON = JSON.stringify(navHistory.slice(0, 1825)); // Max 5 years
    
    // Get data points for 1, 3, and 5 years
    const oneYearData = navHistory.slice(0, Math.min(365, navHistory.length));
    const threeYearData = navHistory.slice(0, Math.min(1095, navHistory.length));
    const fiveYearData = navHistory.slice(0, Math.min(1825, navHistory.length));
    
    // Calculate growth percentages
    const latestNav = parseFloat(navHistory[0].nav);
    const oneYearGrowth = oneYearData.length > 0 ? 
        ((latestNav - parseFloat(oneYearData[oneYearData.length - 1].nav)) / parseFloat(oneYearData[oneYearData.length - 1].nav) * 100).toFixed(2) : 'N/A';
    const threeYearGrowth = threeYearData.length >= 1095 ? 
        ((latestNav - parseFloat(threeYearData[threeYearData.length - 1].nav)) / parseFloat(threeYearData[threeYearData.length - 1].nav) * 100).toFixed(2) : 'N/A';
    const fiveYearGrowth = fiveYearData.length >= 1825 ? 
        ((latestNav - parseFloat(fiveYearData[fiveYearData.length - 1].nav)) / parseFloat(fiveYearData[fiveYearData.length - 1].nav) * 100).toFixed(2) : 'N/A';
    
    return `
        <div class="chart-description">
            <i class="fas fa-info-circle"></i>
            <strong>NAV Data:</strong> Historical Net Asset Value showing fund performance over different time periods
        </div>
        
        <div class="growth-tabs">
            <div class="growth-tab ${oneYearGrowth !== 'N/A' ? 'active' : 'disabled'}" 
                 onclick="${oneYearGrowth !== 'N/A' ? `updateChart('${schemeId}', 365)` : ''}"
                 style="${oneYearGrowth !== 'N/A' ? 'cursor: pointer;' : ''}">
                <div class="tab-label">1 Year</div>
                <div class="tab-value ${parseFloat(oneYearGrowth) >= 0 ? 'positive' : 'negative'}">${oneYearGrowth}%</div>
            </div>
            <div class="growth-tab ${threeYearGrowth !== 'N/A' ? '' : 'disabled'}"
                 onclick="${threeYearGrowth !== 'N/A' ? `updateChart('${schemeId}', 1095)` : ''}"
                 style="${threeYearGrowth !== 'N/A' ? 'cursor: pointer;' : ''}">
                <div class="tab-label">3 Year</div>
                <div class="tab-value ${parseFloat(threeYearGrowth) >= 0 ? 'positive' : 'negative'}">${threeYearGrowth}%</div>
            </div>
            <div class="growth-tab ${fiveYearGrowth !== 'N/A' ? '' : 'disabled'}"
                 onclick="${fiveYearGrowth !== 'N/A' ? `updateChart('${schemeId}', 1825)` : ''}"
                 style="${fiveYearGrowth !== 'N/A' ? 'cursor: pointer;' : ''}">
                <div class="tab-label">5 Year</div>
                <div class="tab-value ${parseFloat(fiveYearGrowth) >= 0 ? 'positive' : 'negative'}">${fiveYearGrowth}%</div>
            </div>
        </div>
        
        <div id="${schemeId}" data-nav='${navDataJSON.replace(/'/g, "&apos;")}'>
            ${renderChart(oneYearData, 365, schemeId)}
        </div>
    `;
}

function renderChart(data, days, schemeId) {
    if (!data || data.length < 2) {
        return '<p style="text-align: center; color: var(--gray-500);">Insufficient data for chart</p>';
    }
    
    // Sample data points for performance
    const sampleInterval = Math.max(1, Math.floor(data.length / 50));
    const chartData = data.filter((_, index) => index % sampleInterval === 0).reverse();
    
    // Find min and max NAV for scaling
    const navValues = chartData.map(d => parseFloat(d.nav));
    const minNav = Math.min(...navValues);
    const maxNav = Math.max(...navValues);
    const navRange = maxNav - minNav || 1;
    
    // Chart dimensions
    const padding = 10;
    const svgWidth = 100;
    const svgHeight = 70;
    const chartWidth = svgWidth - padding * 2;
    const chartHeight = svgHeight - padding * 2;
    
    // Generate points
    const points = chartData.map((item, index) => {
        const x = padding + (index / (chartData.length - 1)) * chartWidth;
        const navValue = parseFloat(item.nav);
        const y = padding + chartHeight - ((navValue - minNav) / navRange) * chartHeight;
        return `${x},${y}`;
    }).join(' ');
    
    // Y-axis labels (5 levels)
    const yAxisLabels = Array.from({length: 5}, (_, i) => {
        const value = minNav + (navRange * (4 - i) / 4);
        const y = padding + (i / 4) * chartHeight;
        return { value: value.toFixed(1), y };
    });
    
    // X-axis labels (months)
    const period = days === 365 ? '1 Year' : days === 1095 ? '3 Years' : '5 Years';
    const monthLabels = days === 365 ? 
        ['Now', '9M', '6M', '3M', 'Start'] :
        days === 1095 ?
        ['Now', '30M', '24M', '18M', '12M', '6M', 'Start'] :
        ['Now', '4Y', '3Y', '2Y', '1Y', 'Start'];
    
    return `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="growth-chart" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="chartGradient_${schemeId}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.05" />
                </linearGradient>
            </defs>
            
            <!-- Y-axis -->
            <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${svgHeight - padding}" stroke="#94a3b8" stroke-width="0.3"/>
            
            <!-- X-axis -->
            <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="#94a3b8" stroke-width="0.3"/>
            
            <!-- Grid lines with Y-axis labels -->
            ${yAxisLabels.map(label => `
                <line x1="${padding}" y1="${label.y}" x2="${svgWidth - padding}" y2="${label.y}" stroke="#e2e8f0" stroke-width="0.15" opacity="0.5"/>
                <text x="${padding - 1}" y="${label.y + 0.8}" font-size="2" fill="#64748b" text-anchor="end">₹${label.value}</text>
            `).join('')}
            
            <!-- X-axis month markers -->
            ${monthLabels.map((label, index) => {
                const x = padding + (index / (monthLabels.length - 1)) * chartWidth;
                return `
                    <line x1="${x}" y1="${svgHeight - padding}" x2="${x}" y2="${svgHeight - padding + 1}" stroke="#94a3b8" stroke-width="0.3"/>
                    <text x="${x}" y="${svgHeight - padding + 3.5}" font-size="2.2" fill="#64748b" text-anchor="middle">${label}</text>
                `;
            }).join('')}
            
            <!-- Area under curve -->
            <polygon 
                points="${points} ${svgWidth - padding},${svgHeight - padding} ${padding},${svgHeight - padding}" 
                fill="url(#chartGradient_${schemeId})"
            />
            
            <!-- Line -->
            <polyline
                points="${points}"
                fill="none"
                stroke="#10b981"
                stroke-width="0.6"
            />
            
            <!-- Data points -->
            ${chartData.map((item, index) => {
                const x = padding + (index / (chartData.length - 1)) * chartWidth;
                const navValue = parseFloat(item.nav);
                const y = padding + chartHeight - ((navValue - minNav) / navRange) * chartHeight;
                return `<circle cx="${x}" cy="${y}" r="0.5" fill="#059669">
                    <title>${item.date}: ₹${item.nav}</title>
                </circle>`;
            }).join('')}
        </svg>
        
        <div class="chart-legend">
            <span>📈 ${period} NAV Trend (${chartData.length} data points)</span>
            <span>Range: ₹${minNav.toFixed(2)} - ₹${maxNav.toFixed(2)}</span>
        </div>
    `;
}

// Update chart when tab is clicked
function updateChart(schemeId, days) {
    const container = document.getElementById(schemeId);
    if (!container) return;
    
    // Get stored NAV history
    const navDataJSON = container.getAttribute('data-nav');
    if (!navDataJSON) return;
    
    const navHistory = JSON.parse(navDataJSON);
    const data = navHistory.slice(0, Math.min(days, navHistory.length));
    
    // Update active tab
    const tabs = container.previousElementSibling.querySelectorAll('.growth-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const tabIndex = days === 365 ? 0 : days === 1095 ? 1 : 2;
    if (tabs[tabIndex]) {
        tabs[tabIndex].classList.add('active');
    }
    
    // Re-render chart
    container.innerHTML = renderChart(data, days, schemeId);
}

function closeModal(event) {
    if (event && event.target.classList.contains('modal-overlay') === false && event.target.classList.contains('modal-close') === false) {
        return;
    }
    
    const modal = document.getElementById('schemeModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .results-table-container');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .results-table-container');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger initial animation
    animateOnScroll();
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    }
    
    // Enter key to trigger analyze
    if (e.key === 'Enter' && (e.target.tagName === 'SELECT' || e.target.tagName === 'BUTTON')) {
        if (e.target.id === 'analyzeBtn' || e.target.closest('.form-group')) {
            handleAnalyze();
        }
    }
});

// Add form validation
function validateForm() {
    const requiredFields = [amcSelect, categorySelect, periodSelect, amountSelect];
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value) {
            field.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            field.style.borderColor = 'var(--gray-300)';
        }
    });
    
    return isValid;
}

// Enhanced analyze function with validation
function handleAnalyze() {
    if (!validateForm()) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    analyzeBtn.classList.add('loading');
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    // Simulate API call delay
    setTimeout(() => {
        const filteredData = filterData();
        displayResults(filteredData);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Reset button state
        analyzeBtn.classList.remove('loading');
        analyzeBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Analyze Funds';
    }, 1500);
}

// Add export functionality
function exportResults() {
    const table = document.querySelector('.results-table');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        const rowData = cells.map(cell => `"${cell.textContent.trim()}"`).join(',');
        csvContent += rowData + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mutual_fund_analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add print functionality
function printResults() {
    const printWindow = window.open('', '_blank');
    const table = document.querySelector('.results-table').outerHTML;
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Mutual Fund Analysis Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Mutual Fund Analysis Report</h1>
                <p>Generated on: ${new Date().toLocaleDateString()}</p>
                ${table}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll handler
window.addEventListener('scroll', debounce(handleScroll, 10));
window.addEventListener('scroll', debounce(animateOnScroll, 10));

// ==================== SEARCH FUNCTIONALITY ====================

function initializeSearch() {
    const searchBox = document.getElementById('fundSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchBox || !searchResults) return;
    
    // Add input event listener with debounce
    searchBox.addEventListener('input', debounce(handleSearch, 300));
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box-wrapper')) {
            searchResults.classList.remove('show');
        }
    });
    
    // Handle keyboard navigation
    searchBox.addEventListener('keydown', handleSearchKeyboard);
}

async function handleSearch(event) {
    const query = event.target.value.trim();
    const searchResults = document.getElementById('searchResults');
    
    if (query.length < 2) {
        searchResults.classList.remove('show');
        return;
    }
    
    // Show loading state
    searchResults.innerHTML = '<div class="no-results">🔍 Searching...</div>';
    searchResults.classList.add('show');
    
    try {
        // Search in real-time schemes data
        const allSchemes = window.realTimeSchemes || [];
        
        if (allSchemes.length === 0) {
            searchResults.innerHTML = '<div class="no-results">⚠️ Loading data... Please wait.</div>';
            return;
        }
        
        // Filter schemes based on query
        const results = allSchemes.filter(scheme => 
            scheme.schemeName.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10); // Limit to 10 results
        
        // Display results
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">❌ No mutual funds found matching your search.</div>';
        } else {
            searchResults.innerHTML = results.map(scheme => {
                const highlightedName = highlightMatch(scheme.schemeName, query);
                return `
                    <div class="search-result-item" onclick="selectFund('${scheme.schemeCode}', '${escapeHtml(scheme.schemeName)}')">
                        <div class="result-name">${highlightedName}</div>
                        <div class="result-meta">Code: ${scheme.schemeCode} • ${scheme.amc}</div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="no-results">❌ Error performing search.</div>';
    }
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="result-highlight">$1</span>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

async function selectFund(schemeCode, schemeName) {
    console.log(`📊 Selected fund: ${schemeName} (${schemeCode})`);
    
    // Close search results
    document.getElementById('searchResults').classList.remove('show');
    
    // Clear search box
    document.getElementById('fundSearch').value = schemeName;
    
    // Show loading notification
    showNotification(`Loading details for ${schemeName}...`, 'info');
    
    try {
        // Fetch scheme details
        const details = await window.MFApiService.getSchemeDetails(schemeCode);
        
        if (details) {
            // Scroll to results section
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
            
            // Display the fund details
            displayFundDetails(details);
            
            showNotification('Fund details loaded successfully!', 'success');
        }
    } catch (error) {
        console.error('Error loading fund details:', error);
        showNotification('Error loading fund details', 'error');
    }
}

function displayFundDetails(details) {
    const resultsTableBody = document.getElementById('resultsTableBody');
    
    if (!resultsTableBody) return;
    
    // Create a single row with the fund details
    const nav = details.latestNav || 'N/A';
    const oneYearReturn = details.returns?.oneYear?.value || 'N/A';
    const threeYearReturn = details.returns?.threeYear?.value || 'N/A';
    
    resultsTableBody.innerHTML = `
        <tr>
            <td>
                <a href="#" class="scheme-name">${details.meta.scheme_name}</a>
            </td>
            <td>${details.meta.fund_house || 'N/A'}</td>
            <td>N/A</td>
            <td>Latest</td>
            <td>N/A</td>
            <td>₹${nav}</td>
            <td class="${oneYearReturn !== 'N/A' && parseFloat(oneYearReturn) >= 0 ? 'return-positive' : 'return-negative'}">
                ${oneYearReturn}${oneYearReturn !== 'N/A' ? '%' : ''}
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewDetails('${escapeHtml(details.meta.scheme_name)}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `;
    
    // Update summary
    const summaryElements = document.querySelectorAll('.summary-value');
    if (summaryElements.length >= 3) {
        summaryElements[0].textContent = oneYearReturn !== 'N/A' ? oneYearReturn + '%' : 'N/A';
        summaryElements[1].textContent = details.meta.scheme_name.split(' ').slice(0, 3).join(' ');
        summaryElements[2].textContent = '1';
    }
}

// viewFullDetails removed - now using viewDetails with modal popup instead

function handleSearchKeyboard(event) {
    const searchResults = document.getElementById('searchResults');
    const items = searchResults.querySelectorAll('.search-result-item');
    
    if (event.key === 'Escape') {
        searchResults.classList.remove('show');
        event.target.blur();
    }
    
    // Add arrow key navigation if needed
    if (event.key === 'ArrowDown' && items.length > 0) {
        event.preventDefault();
        items[0].focus();
    }
}
