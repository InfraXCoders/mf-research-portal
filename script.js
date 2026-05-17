/* ═══════════════════════════════════════════════════════════
   ANKUR BATHLA – MF EDUCATOR · MAIN APP SCRIPT
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initStatCounters();
    initSIPCalculator();
    initLumpsumCalculator();
    initToolTabs();
    initFundSearch();
    initRangeSliders();
    initActiveNavLinks();
    initSearchTips();

    if (window.MFApiService) {
        window.MFApiService.initialize().then(() => {
            window.MFApiService.getAllSchemes().then(schemes => {
                if (schemes) window.realTimeSchemes = schemes;
            });
        });
    }
});

/* ─── HEADER scroll effect ────────────────────────────── */
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

/* ─── MOBILE MENU ─────────────────────────────────────── */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.nav') && navLinks?.classList.contains('open')) {
            navLinks.classList.remove('open');
        }
    });
}

/* ─── ACTIVE NAV on scroll ────────────────────────────── */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                active?.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
}

/* ─── ANIMATED STAT COUNTERS ──────────────────────────── */
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const format = (n, target) => {
        if (target >= 100000) return (n / 100000).toFixed(1).replace('.0','') + ' L+';
        if (target >= 1000)   return (n / 1000).toFixed(0) + '+';
        return n + '+';
    };

    const animateCounter = el => {
        const target   = parseInt(el.dataset.count);
        const duration = 1800;
        const step     = 16;
        const steps    = duration / step;
        let current    = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            el.textContent = format(Math.floor(current), target);
            if (current >= target) clearInterval(timer);
        }, step);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ─── RANGE SLIDER gradient update ───────────────────── */
function initRangeSliders() {
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const update = () => {
            const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
            slider.style.background = `linear-gradient(to right, var(--blue) 0%, var(--blue) ${pct}%, var(--gray-200) ${pct}%, var(--gray-200) 100%)`;
        };
        slider.addEventListener('input', update);
        update();
    });
}

/* ─── TOOL TABS ───────────────────────────────────────── */
function initToolTabs() {
    document.querySelectorAll('.tool-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(`tab-${tab.dataset.tab}`);
            panel?.classList.add('active');
        });
    });
}

/* ─── SIP CALCULATOR ──────────────────────────────────── */
function initSIPCalculator() {
    const ids = ['sip-amount', 'sip-years', 'sip-return', 'sip-stepup'];
    ids.forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateSIP);
    });
    updateSIP();
}

function updateSIP() {
    const amount  = parseInt(document.getElementById('sip-amount')?.value || 5000);
    const years   = parseInt(document.getElementById('sip-years')?.value  || 15);
    const retPct  = parseFloat(document.getElementById('sip-return')?.value || 12);
    const stepup  = parseInt(document.getElementById('sip-stepup')?.value  || 0);

    setVal('sip-amount-val', `₹${fmtNum(amount)}`);
    setVal('sip-years-val',  `${years} Year${years > 1 ? 's' : ''}`);
    setVal('sip-return-val', `${retPct}%`);
    setVal('sip-stepup-val', stepup === 0 ? '0% (No step-up)' : `${stepup}% p.a.`);

    let corpus = 0;
    let invested = 0;
    let currentAmount = amount;
    const monthlyRate = retPct / 12 / 100;

    for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
            invested += currentAmount;
            corpus    = (corpus + currentAmount) * (1 + monthlyRate);
        }
        if (stepup > 0) currentAmount = Math.round(currentAmount * (1 + stepup / 100));
    }

    const gain    = corpus - invested;
    const months  = years * 12;
    const retPctTotal = ((corpus - invested) / invested * 100).toFixed(0);
    const investedPct = (invested / corpus * 100);
    const gainsPct    = 100 - investedPct;

    setVal('sip-corpus',     `₹${fmtCr(corpus)}`);
    setVal('sip-gain',       `+₹${fmtCr(gain)} wealth gain`);
    setVal('sip-invested',   `₹${fmtCr(invested)}`);
    setVal('sip-wealth-gain',`₹${fmtCr(gain)}`);
    setVal('sip-months',     `${months} months`);
    setVal('sip-returns-pct',`${retPctTotal}%`);

    setWidth('bar-invested', investedPct);
    setWidth('bar-gains',    gainsPct);
}

/* ─── LUMPSUM CALCULATOR ──────────────────────────────── */
function initLumpsumCalculator() {
    ['ls-amount','ls-years','ls-return'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateLumpsum);
    });
    updateLumpsum();
}

function updateLumpsum() {
    const amount = parseInt(document.getElementById('ls-amount')?.value || 100000);
    const years  = parseInt(document.getElementById('ls-years')?.value  || 10);
    const ret    = parseFloat(document.getElementById('ls-return')?.value || 12);

    setVal('ls-amount-val', `₹${fmtNum(amount)}`);
    setVal('ls-years-val',  `${years} Year${years > 1 ? 's' : ''}`);
    setVal('ls-return-val', `${ret}%`);

    const corpus = amount * Math.pow(1 + ret / 100, years);
    const gain   = corpus - amount;

    setVal('ls-corpus',         `₹${fmtCr(corpus)}`);
    setVal('ls-gain',           `+₹${fmtCr(gain)} wealth gain`);
    setVal('ls-invested-display',`₹${fmtCr(amount)}`);
    setVal('ls-gain-display',   `₹${fmtCr(gain)}`);

    const investedPct = (amount / corpus * 100);
    setWidth('ls-bar-invested', investedPct);
    setWidth('ls-bar-gains',    100 - investedPct);
}

/* ─── FUND SEARCH ─────────────────────────────────────── */
function initFundSearch() {
    const input   = document.getElementById('fundSearch');
    const results = document.getElementById('searchResults');
    if (!input || !results) return;

    input.addEventListener('input', debounce(handleSearch, 280));

    document.addEventListener('click', e => {
        if (!e.target.closest('.search-wrapper')) {
            results.classList.remove('show');
        }
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Escape') { results.classList.remove('show'); input.blur(); }
    });
}

async function handleSearch(e) {
    const query   = e.target.value.trim();
    const results = document.getElementById('searchResults');

    if (query.length < 2) { results.classList.remove('show'); return; }

    results.innerHTML = '<div class="no-results">🔍 Searching...</div>';
    results.classList.add('show');

    const schemes = window.realTimeSchemes || [];
    if (!schemes.length) {
        results.innerHTML = '<div class="no-results">⏳ Loading fund data, please wait...</div>';
        return;
    }

    const q = query.toLowerCase();
    const hits = schemes.filter(s => s.schemeName.toLowerCase().includes(q)).slice(0, 10);

    if (!hits.length) {
        results.innerHTML = '<div class="no-results">No funds found. Try a different name.</div>';
        return;
    }

    results.innerHTML = hits.map(s => `
        <div class="search-result-item" data-code="${s.schemeCode}">
            <div class="result-name">${highlight(s.schemeName, query)}</div>
            <div class="result-meta">Code: ${s.schemeCode} &nbsp;·&nbsp; ${s.amc}</div>
        </div>
    `).join('');

    results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => selectFund(item.dataset.code, item.querySelector('.result-name').textContent));
    });
}

async function selectFund(code, name) {
    const input   = document.getElementById('fundSearch');
    const results = document.getElementById('searchResults');
    const panel   = document.getElementById('fund-details-panel');

    results.classList.remove('show');
    input.value = name;

    panel.style.display = 'block';
    panel.innerHTML = `<div style="text-align:center;padding:24px;color:var(--gray-500)"><i class="fas fa-spinner fa-spin" style="font-size:24px;color:var(--blue)"></i><p style="margin-top:12px">Loading fund details...</p></div>`;

    try {
        const details = await window.MFApiService?.getSchemeDetails(code);
        if (!details) throw new Error('No data');
        renderFundDetails(panel, details);
    } catch {
        panel.innerHTML = `<div style="text-align:center;padding:24px;color:var(--gray-500)"><i class="fas fa-exclamation-circle" style="color:var(--danger)"></i> Could not load details. Try again.</div>`;
    }
}

function renderFundDetails(panel, d) {
    const nav    = d.latestNav || 'N/A';
    const r      = d.returns   || {};
    const meta   = d.meta      || {};

    const retVal = (obj) => obj?.value ? `${parseFloat(obj.value) >= 0 ? '+' : ''}${obj.value}%` : 'N/A';
    const retClass = (obj) => obj?.value ? (parseFloat(obj.value) >= 0 ? 'positive' : 'negative') : '';

    panel.innerHTML = `
        <div class="fund-detail-header">
            <h3>${meta.scheme_name || 'Fund Details'}</h3>
            <p>${meta.fund_house || ''} &nbsp;·&nbsp; ${meta.scheme_category || ''}</p>
        </div>
        <div>
            <span style="font-size:12px;color:var(--gray-500)">Latest NAV</span>
            <div class="fund-nav-big">₹${nav}</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:4px">as on ${d.data?.[0]?.date || 'N/A'}</div>
        </div>
        <div class="fund-returns-grid">
            <div class="return-box">
                <span class="rb-label">1 Year</span>
                <span class="rb-val ${retClass(r.oneYear)}">${retVal(r.oneYear)}</span>
            </div>
            <div class="return-box">
                <span class="rb-label">2 Year</span>
                <span class="rb-val ${retClass(r.twoYear)}">${retVal(r.twoYear)}</span>
            </div>
            <div class="return-box">
                <span class="rb-label">3 Year</span>
                <span class="rb-val ${retClass(r.threeYear)}">${retVal(r.threeYear)}</span>
            </div>
            <div class="return-box">
                <span class="rb-label">5 Year</span>
                <span class="rb-val ${retClass(r.fiveYear)}">${retVal(r.fiveYear)}</span>
            </div>
        </div>
        <div style="text-align:right;margin-top:16px">
            <button class="btn-primary" onclick="showSchemeDetailsModal(window._lastFundDetails)" style="font-size:13px;padding:10px 20px">
                <i class="fas fa-chart-line"></i> Full Analysis
            </button>
        </div>
    `;
    window._lastFundDetails = d;
}

/* ─── SEARCH TIPS click-to-fill ───────────────────────── */
function initSearchTips() {
    document.querySelectorAll('.tip').forEach(tip => {
        tip.addEventListener('click', () => {
            const input = document.getElementById('fundSearch');
            if (!input) return;
            const text = tip.textContent.replace('Try:','').replace(/"/g,'').trim();
            input.value = text;
            input.dispatchEvent(new Event('input'));
        });
    });
}

/* ─── MODAL (Fund full analysis) ─────────────────────── */
function showSchemeDetailsModal(details) {
    if (!details) return;
    const navHistory = details.data || [];

    let cagrSinceInception = 'N/A';
    if (navHistory.length > 0) {
        const latestNav = parseFloat(navHistory[0].nav);
        const oldestNav = parseFloat(navHistory[navHistory.length - 1].nav);
        const yrs = navHistory.length / 365;
        if (yrs > 0 && oldestNav > 0)
            cagrSinceInception = ((Math.pow(latestNav / oldestNav, 1 / yrs) - 1) * 100).toFixed(2);
    }

    let navChange = 'N/A', navChangePercent = 'N/A';
    if (navHistory.length >= 2) {
        const l = parseFloat(navHistory[0].nav);
        const p = parseFloat(navHistory[1].nav);
        navChange        = (l - p).toFixed(2);
        navChangePercent = ((parseFloat(navChange) / p) * 100).toFixed(4);
    }

    const r = details.returns || {};
    const rv = (obj) => obj?.value ?? 'N/A';
    const rc = (obj) => obj?.value ? (parseFloat(obj.value) >= 0 ? 'positive' : 'negative') : '';

    const modalHTML = `
        <div class="modal-overlay" id="schemeModal" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <h2 class="modal-title">${details.meta?.scheme_name || 'Fund Analysis'}</h2>

                <div class="modal-info-grid">
                    <div class="info-item"><span class="info-label">Category</span><span class="info-value">${details.meta?.scheme_category || 'N/A'}</span></div>
                    <div class="info-item"><span class="info-label">Asset Class</span><span class="info-value">${details.meta?.scheme_type || 'N/A'}</span></div>
                    <div class="info-item"><span class="info-label">Fund House</span><span class="info-value">${details.meta?.fund_house || 'N/A'}</span></div>
                    <div class="info-item"><span class="info-label">Scheme Code</span><span class="info-value">${details.meta?.scheme_code || 'N/A'}</span></div>
                </div>

                <div class="nav-highlight">
                    <div class="nav-main">
                        <span class="nav-label">NAV as on ${details.data?.[0]?.date || 'N/A'}</span>
                        <span class="nav-price">₹${details.latestNav || 'N/A'}</span>
                        <span class="nav-change ${parseFloat(navChange) >= 0 ? 'positive' : 'negative'}">
                            ${navChange !== 'N/A' ? (parseFloat(navChange) >= 0 ? '+' : '') + navChange : ''}
                            ${navChangePercent !== 'N/A' ? `(${navChangePercent}%)` : ''}
                        </span>
                    </div>
                    <div class="cagr-box">
                        <span class="cagr-label">CAGR Since Inception</span>
                        <span class="cagr-value">${cagrSinceInception}%</span>
                    </div>
                </div>

                <div class="modal-stats">
                    <div class="stat-box"><span class="stat-label">1Y Return</span><span class="stat-value ${rc(r.oneYear)}">${rv(r.oneYear)}${r.oneYear?.value ? '%' : ''}</span></div>
                    <div class="stat-box"><span class="stat-label">2Y Return</span><span class="stat-value ${rc(r.twoYear)}">${rv(r.twoYear)}${r.twoYear?.value ? '%' : ''}</span></div>
                    <div class="stat-box"><span class="stat-label">3Y Return</span><span class="stat-value ${rc(r.threeYear)}">${rv(r.threeYear)}${r.threeYear?.value ? '%' : ''}</span></div>
                    <div class="stat-box"><span class="stat-label">5Y Return</span><span class="stat-value ${rc(r.fiveYear)}">${rv(r.fiveYear)}${r.fiveYear?.value ? '%' : ''}</span></div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-chart-line"></i> Performance Chart</h3>
                    <div class="growth-chart-container">${generateGrowthChart(navHistory)}</div>
                </div>

                <div class="modal-section">
                    <h3><i class="fas fa-history"></i> NAV History (Last 30 Days)</h3>
                    <div class="nav-history">
                        ${navHistory.slice(0, 30).map((item, i) => `
                            <div class="nav-item">
                                <span class="nav-date">${item.date}</span>
                                <span class="nav-value">₹${item.nav}</span>
                                ${i > 0 ? `<span class="nav-change-small ${parseFloat(item.nav) >= parseFloat(navHistory[i-1].nav) ? 'positive' : 'negative'}">
                                    ${((parseFloat(item.nav) - parseFloat(navHistory[i-1].nav)) / parseFloat(navHistory[i-1].nav) * 100).toFixed(2)}%
                                </span>` : ''}
                            </div>
                        `).join('') || '<p style="padding:16px;color:var(--gray-500)">No history available</p>'}
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn-primary" onclick="closeModal()"><i class="fas fa-check"></i> Done</button>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && !event.target.classList.contains('modal-overlay') && !event.target.classList.contains('modal-close')) return;
    const modal = document.getElementById('schemeModal');
    if (modal) { modal.remove(); document.body.style.overflow = ''; }
}

/* ─── CHART helpers (re-used from original) ──────────── */
function generateGrowthChart(navHistory) {
    if (!navHistory || navHistory.length < 2)
        return '<p style="text-align:center;color:var(--gray-500);padding:20px">Insufficient data for chart</p>';

    const id = 'chart_' + Date.now();
    const navDataJSON = JSON.stringify(navHistory.slice(0, 1825)).replace(/'/g, '&apos;');

    const oneY  = navHistory.slice(0, Math.min(365, navHistory.length));
    const threeY = navHistory.slice(0, Math.min(1095, navHistory.length));
    const fiveY  = navHistory.slice(0, Math.min(1825, navHistory.length));
    const latest = parseFloat(navHistory[0].nav);

    const growth = (data) => data.length > 0
        ? ((latest - parseFloat(data[data.length-1].nav)) / parseFloat(data[data.length-1].nav) * 100).toFixed(2)
        : 'N/A';

    const g1 = growth(oneY);
    const g3 = threeY.length >= 1095 ? growth(threeY) : 'N/A';
    const g5 = fiveY.length  >= 1825 ? growth(fiveY)  : 'N/A';

    const tabItem = (label, val, days) => val === 'N/A'
        ? `<div class="growth-tab disabled"><div class="tab-label">${label}</div><div class="tab-value">N/A</div></div>`
        : `<div class="growth-tab" onclick="updateChart('${id}',${days})" style="cursor:pointer"><div class="tab-label">${label}</div><div class="tab-value ${parseFloat(val)>=0?'positive':'negative'}">${val}%</div></div>`;

    return `
        <div class="growth-tabs">
            <div class="growth-tab active" onclick="updateChart('${id}',365)" style="cursor:pointer"><div class="tab-label">1 Year</div><div class="tab-value ${parseFloat(g1)>=0?'positive':'negative'}">${g1}%</div></div>
            ${tabItem('3 Year', g3, 1095)}
            ${tabItem('5 Year', g5, 1825)}
        </div>
        <div id="${id}" data-nav='${navDataJSON}'>${renderChart(oneY, 365, id)}</div>`;
}

function renderChart(data, days, id) {
    if (!data || data.length < 2)
        return '<p style="text-align:center;color:var(--gray-500)">Insufficient data</p>';

    const interval  = Math.max(1, Math.floor(data.length / 50));
    const chartData = data.filter((_, i) => i % interval === 0).reverse();
    const navVals   = chartData.map(d => parseFloat(d.nav));
    const minNav    = Math.min(...navVals), maxNav = Math.max(...navVals);
    const range     = maxNav - minNav || 1;
    const pad = 10, sw = 100, sh = 70, cw = sw - pad*2, ch = sh - pad*2;

    const points = chartData.map((item, i) => {
        const x = pad + (i / (chartData.length - 1)) * cw;
        const y = pad + ch - ((parseFloat(item.nav) - minNav) / range) * ch;
        return `${x},${y}`;
    }).join(' ');

    const yLabels = Array.from({length: 5}, (_, i) => ({
        value: (minNav + range * (4-i) / 4).toFixed(1),
        y: pad + (i/4) * ch
    }));

    const xLabels = days === 365  ? ['Now','9M','6M','3M','Start']
                  : days === 1095 ? ['Now','2Y','18M','1Y','6M','Start']
                  :                 ['Now','4Y','3Y','2Y','1Y','Start'];

    return `
        <svg viewBox="0 0 ${sw} ${sh}" class="growth-chart" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="g_${id}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.4"/>
                    <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.02"/>
                </linearGradient>
            </defs>
            <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${sh-pad}" stroke="#94a3b8" stroke-width="0.3"/>
            <line x1="${pad}" y1="${sh-pad}" x2="${sw-pad}" y2="${sh-pad}" stroke="#94a3b8" stroke-width="0.3"/>
            ${yLabels.map(l => `
                <line x1="${pad}" y1="${l.y}" x2="${sw-pad}" y2="${l.y}" stroke="#e2e8f0" stroke-width="0.15" opacity="0.5"/>
                <text x="${pad-1}" y="${l.y+0.8}" font-size="2" fill="#64748b" text-anchor="end">₹${l.value}</text>
            `).join('')}
            ${xLabels.map((lbl, i) => {
                const x = pad + (i / (xLabels.length-1)) * cw;
                return `<text x="${x}" y="${sh-pad+3.5}" font-size="2.2" fill="#64748b" text-anchor="middle">${lbl}</text>`;
            }).join('')}
            <polygon points="${points} ${sw-pad},${sh-pad} ${pad},${sh-pad}" fill="url(#g_${id})"/>
            <polyline points="${points}" fill="none" stroke="#10b981" stroke-width="0.6"/>
            ${chartData.map((item, i) => {
                const x = pad + (i / (chartData.length-1)) * cw;
                const y = pad + ch - ((parseFloat(item.nav)-minNav)/range) * ch;
                return `<circle cx="${x}" cy="${y}" r="0.5" fill="#059669"><title>${item.date}: ₹${item.nav}</title></circle>`;
            }).join('')}
        </svg>
        <div class="chart-legend">
            <span>📈 ${days===365?'1 Year':days===1095?'3 Year':'5 Year'} NAV Trend</span>
            <span>₹${minNav.toFixed(2)} – ₹${maxNav.toFixed(2)}</span>
        </div>`;
}

function updateChart(id, days) {
    const container = document.getElementById(id);
    if (!container) return;
    const navHistory = JSON.parse(container.getAttribute('data-nav') || '[]');
    const data = navHistory.slice(0, Math.min(days, navHistory.length));

    container.previousElementSibling?.querySelectorAll('.growth-tab').forEach((tab, i) => {
        tab.classList.toggle('active', (days === 365 && i === 0) || (days === 1095 && i === 1) || (days === 1825 && i === 2));
    });
    container.innerHTML = renderChart(data, days, id);
}

/* ─── NOTIFICATION ────────────────────────────────────── */
function showNotification(msg, type = 'info') {
    const colors = { success: '#059669', error: '#DC2626', info: '#2563EB', warning: '#F59E0B' };
    const icons  = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };
    const el     = document.createElement('div');
    el.className = 'notification';
    el.style.background = colors[type] || colors.info;
    el.innerHTML = `<i class="fas fa-${icons[type]}"></i> ${msg}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

/* ─── SMOOTH SCROLL for anchor links ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ─── UTILITIES ───────────────────────────────────────── */
function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function setWidth(id, pct) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.max(2, Math.min(100, pct)) + '%';
}

function fmtNum(n) {
    if (n >= 10000000) return (n/10000000).toFixed(1) + ' Cr';
    if (n >= 100000)   return (n/100000).toFixed(1) + ' L';
    if (n >= 1000)     return (n/1000).toFixed(0) + 'K';
    return n.toLocaleString('en-IN');
}

function fmtCr(n) {
    if (n >= 10000000) return (n/10000000).toFixed(2) + ' Cr';
    if (n >= 100000)   return (n/100000).toFixed(1) + ' L';
    if (n >= 1000)     return (n/1000).toFixed(0) + 'K';
    return Math.round(n).toLocaleString('en-IN');
}

function highlight(text, query) {
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    return text.replace(re, '<span class="result-highlight">$1</span>');
}

function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
