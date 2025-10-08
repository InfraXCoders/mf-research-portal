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

// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsTableBody = document.getElementById('resultsTableBody');
const resultsSection = document.getElementById('results');
const amcSelect = document.getElementById('amc');
const categorySelect = document.getElementById('category');
const periodSelect = document.getElementById('period');
const amountSelect = document.getElementById('amount');

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    console.log('🚀 Initializing MF Research Portal...');
    
    // Initialize API Service
    if (window.MFApiService) {
        await window.MFApiService.initialize();
        console.log('✅ API Service initialized');
        
        // Try to load real-time data
        await loadRealTimeData();
    } else {
        console.warn('⚠️ API Service not available, using sample data');
    }
    
    // Add event listeners
    analyzeBtn.addEventListener('click', handleAnalyze);
    resetBtn.addEventListener('click', handleReset);
    
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
    
    // Initialize with default data
    displayResults(mutualFundData);
    
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
    const amcs = [...new Set(schemes.map(s => s.amc))].filter(amc => amc !== 'Other');
    amcs.sort();
    
    // Clear existing options (except "All AMCs")
    while (amcSelect.options.length > 1) {
        amcSelect.remove(1);
    }
    
    // Add real AMCs
    amcs.forEach(amc => {
        const option = document.createElement('option');
        option.value = amc.toLowerCase().replace(/\s+/g, '-');
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

function handleAnalyze() {
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

function handleReset() {
    // Reset all form fields
    amcSelect.value = '';
    categorySelect.value = '';
    periodSelect.value = '1';
    amountSelect.value = '100000';
    
    // Display all data
    displayResults(mutualFundData);
    
    // Scroll to top of results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
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

function displayResults(data) {
    if (!resultsTableBody) return;
    
    // Clear existing results
    resultsTableBody.innerHTML = '';
    
    if (data.length === 0) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center" style="padding: 2rem; color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No funds found matching your criteria
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by annual return (descending)
    data.sort((a, b) => b.annualReturn - a.annualReturn);
    
    // Display results
    data.forEach((fund, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <a href="#" class="scheme-name">${fund.schemeName}</a>
            </td>
            <td>${formatNumber(fund.aum)} Cr</td>
            <td>${fund.from}</td>
            <td>${fund.to}</td>
            <td>₹${formatNumber(fund.investedAmount)}</td>
            <td>₹${formatNumber(fund.currentValue)}</td>
            <td class="${fund.annualReturn >= 0 ? 'return-positive' : 'return-negative'}">
                ${fund.annualReturn.toFixed(2)}%
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewDetails('${fund.schemeName}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
    
    // Update summary
    updateSummary(data);
}

function updateSummary(data) {
    const avgReturn = data.reduce((sum, fund) => sum + fund.annualReturn, 0) / data.length;
    const bestFund = data[0];
    
    // Update summary elements if they exist
    const summaryElements = document.querySelectorAll('.summary-value');
    if (summaryElements.length >= 3) {
        summaryElements[0].textContent = `${avgReturn.toFixed(2)}%`;
        summaryElements[1].textContent = `${bestFund.schemeName.split(' ')[0]} (${bestFund.annualReturn.toFixed(2)}%)`;
        summaryElements[2].textContent = data.length.toString();
    }
}

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

function viewDetails(schemeName) {
    // Simulate viewing fund details
    alert(`Viewing details for: ${schemeName}\n\nThis would typically open a detailed fund analysis page with:\n- Historical performance charts\n- Portfolio composition\n- Risk metrics\n- Expense ratios\n- Fund manager information`);
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
