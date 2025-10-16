// RSS Service for Financial News (100% Free)
class RSSService {
    constructor() {
        this.rssFeeds = {
            economicTimes: 'https://economictimes.indiatimes.com/rssfeeds/1715249553.cms',
            businessStandard: 'https://www.business-standard.com/rss/home_page_top_stories.rss',
            moneycontrol: 'https://www.moneycontrol.com/rss/business.xml',
            cnbcTV18: 'https://www.cnbctv18.com/rss/business.xml',
            financialExpress: 'https://www.financialexpress.com/feed/',
            livemint: 'https://www.livemint.com/rss/markets',
            businessToday: 'https://www.businesstoday.in/rssfeeds/120/rss.xml'
        };
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
        
        // Keywords to filter relevant Indian financial news
        this.relevantKeywords = [
            // Mutual Funds & Investment
            'mutual fund', 'mf', 'sip', 'nav', 'aum', 'fund', 'investment',
            'sebi', 'amfi', 'fund house', 'asset management', 'portfolio',
            'returns', 'performance', 'scheme', 'category', 'debt fund',
            'equity fund', 'hybrid fund', 'large cap', 'mid cap', 'small cap',
            'sector fund', 'index fund', 'etf', 'reits', 'gold fund',
            
            // Indian Stock Markets
            'nifty', 'sensex', 'bse', 'nse', 'stock', 'equity', 'market',
            'nifty 50', 'nifty bank', 'bank nifty', 'nifty it', 'nifty auto',
            'nifty pharma', 'nifty metal', 'nifty energy', 'nifty f&o',
            
            // Indian Companies & Stocks
            'reliance', 'tcs', 'hdfc', 'icici', 'infosys', 'wipro', 'hcl',
            'bharti airtel', 'itc', 'asian paints', 'maruti', 'tata',
            'adani', 'mahindra', 'bajaj', 'hero motocorp', 'ultra tech',
            
            // Banking & Finance
            'banking', 'finance', 'financial', 'rbi', 'interest rate',
            'repo rate', 'crr', 'slr', 'bank', 'credit', 'loan', 'deposit',
            
            // Indian Economy
            'economy', 'gdp', 'inflation', 'indian', 'india', 'rupee',
            'fiscal', 'budget', 'government', 'policy', 'reforms'
        ];
        
        // Keywords to exclude (international/irrelevant news)
        this.excludeKeywords = [
            // International Politics & Countries
            'trump', 'biden', 'usa', 'america', 'europe', 'china', 'ukraine',
            'russia', 'war', 'uk', 'britain', 'france', 'germany', 'japan',
            'australia', 'canada', 'brazil', 'mexico', 'international',
            
            // Health & Pandemic
            'covid', 'pandemic', 'vaccine', 'coronavirus', 'health', 'medical',
            'hospital', 'doctor', 'patient', 'treatment', 'disease',
            
            // Politics & Elections
            'election', 'politics', 'political', 'government', 'minister',
            'parliament', 'assembly', 'vote', 'voting', 'campaign',
            
            // Sports & Entertainment
            'sports', 'cricket', 'football', 'tennis', 'olympics', 'world cup',
            'entertainment', 'bollywood', 'movie', 'film', 'celebrity',
            'actor', 'actress', 'music', 'song', 'concert', 'awards',
            
            // Technology (Non-Financial)
            'technology', 'tech', 'smartphone', 'mobile', 'app', 'software',
            'gaming', 'video game', 'social media', 'facebook', 'twitter',
            
            // Cryptocurrency & Digital Assets
            'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain',
            'digital currency', 'crypto currency', 'crypto market', 'crypto trading',
            'crypto exchange', 'crypto wallet', 'crypto investment', 'crypto news',
            'crypto price', 'crypto market cap', 'crypto trading', 'crypto mining',
            'crypto regulation', 'crypto ban', 'crypto tax', 'crypto policy',
            'dogecoin', 'litecoin', 'ripple', 'cardano', 'solana', 'polygon',
            'binance', 'coinbase', 'crypto exchange', 'crypto wallet',
            
            // Other Irrelevant Topics
            'weather', 'climate', 'environment', 'pollution', 'education',
            'school', 'college', 'university', 'student', 'teacher',
            'crime', 'police', 'court', 'legal', 'law', 'accident'
        ];
    }

    // Fetch RSS feed using CORS proxy (free)
    async fetchRSSFeed(feedUrl) {
        try {
            const cacheKey = feedUrl;
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            // Use CORS proxy to avoid CORS issues
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
            
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const xmlText = await response.text();
            const newsItems = this.parseRSSXML(xmlText);
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: newsItems,
                timestamp: Date.now()
            });
            
            return newsItems;
        } catch (error) {
            console.error('Error fetching RSS feed:', error);
            return this.getFallbackNews();
        }
    }

    // Parse RSS XML (simple parser)
    parseRSSXML(xmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            return Array.from(items).map(item => ({
                title: this.getTextContent(item, 'title'),
                description: this.getTextContent(item, 'description'),
                link: this.getTextContent(item, 'link'),
                pubDate: this.getTextContent(item, 'pubDate'),
                source: this.getTextContent(item, 'source') || 'RSS Feed'
            }));
        } catch (error) {
            console.error('Error parsing RSS XML:', error);
            return this.getFallbackNews();
        }
    }

    // Helper to get text content from XML element
    getTextContent(parent, tagName) {
        const element = parent.querySelector(tagName);
        return element ? element.textContent.trim() : '';
    }

    // Fetch multiple RSS feeds and combine
    async fetchAllFinancialNews() {
        try {
            const promises = Object.values(this.rssFeeds).map(url => 
                this.fetchRSSFeed(url).catch(() => [])
            );
            
            const results = await Promise.all(promises);
            const allNews = results.flat();
            
            // Sort by date and remove duplicates
            return this.deduplicateAndSort(allNews);
        } catch (error) {
            console.error('Error fetching all news:', error);
            return this.getFallbackNews();
        }
    }

    // Check if news item is relevant to Indian financial markets
    isRelevantNews(item) {
        const title = item.title.toLowerCase();
        const description = (item.description || '').toLowerCase();
        const content = `${title} ${description}`;
        
        // Check for exclusion keywords first
        for (const excludeKeyword of this.excludeKeywords) {
            if (content.includes(excludeKeyword)) {
                return false;
            }
        }
        
        // Check for relevant keywords
        for (const relevantKeyword of this.relevantKeywords) {
            if (content.includes(relevantKeyword)) {
                return true;
            }
        }
        
        return false;
    }

    // Remove duplicates, filter relevant news, and sort by date
    deduplicateAndSort(newsItems) {
        const seen = new Set();
        const unique = newsItems.filter(item => {
            const key = item.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        
        // Filter for relevant financial news only
        const relevantNews = unique.filter(item => this.isRelevantNews(item));
        
        return relevantNews
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
            .slice(0, 12); // Limit to 12 items
    }

    // Fallback news when RSS fails
    getFallbackNews() {
        return [
            {
                title: "Nifty 50 Gains 1.2% as Banking Stocks Rally",
                description: "Strong Q3 results drive investor confidence in banking sector with HDFC Bank and ICICI Bank leading the gains.",
                link: "https://economictimes.indiatimes.com/markets/stocks/news",
                pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                source: "Economic Times"
            },
            {
                title: "Mutual Fund AUM Crosses ₹50 Lakh Crore Milestone",
                description: "Indian mutual fund industry achieves historic milestone with strong SIP inflows and retail participation.",
                link: "https://www.business-standard.com/markets/mutual-funds",
                pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                source: "Business Standard"
            },
            {
                title: "SEBI Introduces New ESG Fund Guidelines",
                description: "Market regulator announces enhanced disclosure norms for ESG funds to improve transparency and investor protection.",
                link: "https://www.moneycontrol.com/news/business/markets",
                pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                source: "Moneycontrol"
            },
            {
                title: "SIP Investments Hit Record ₹18,000 Crore",
                description: "Systematic Investment Plans reach new monthly high as retail investors continue to invest in mutual funds.",
                link: "https://www.cnbctv18.com/market/",
                pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                source: "CNBC TV18"
            },
            {
                title: "RBI Maintains Repo Rate at 6.5%",
                description: "Central bank keeps interest rates unchanged citing inflation concerns and global economic uncertainties.",
                link: "https://www.financialexpress.com/market/",
                pubDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                source: "Financial Express"
            },
            {
                title: "TCS Reports 12% Revenue Growth in Q3",
                description: "IT major TCS posts strong quarterly results with robust deal pipeline and digital transformation demand.",
                link: "https://economictimes.indiatimes.com/markets/stocks/earnings",
                pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                source: "Economic Times"
            }
        ];
    }

    // Format news for display
    formatNewsForDisplay(newsItems) {
        const formatted = newsItems.slice(0, 6).map((item, index) => ({
            title: this.cleanTitle(item.title),
            description: this.cleanDescription(item.description),
            time: this.getTimeAgo(item.pubDate),
            source: item.source,
            url: item.link,
            featured: index === 0
        }));
        
        // Ensure we always have exactly 6 items
        while (formatted.length < 6) {
            formatted.push({
                title: "Market Update Available",
                description: "Latest financial news and market updates",
                time: "Recently",
                source: "Financial News",
                url: "https://economictimes.indiatimes.com/markets",
                featured: formatted.length === 0
            });
        }
        
        return formatted.slice(0, 6);
    }

    // Clean title (remove HTML tags, etc.)
    cleanTitle(title) {
        return title
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
    }

    // Clean description
    cleanDescription(description) {
        return this.cleanTitle(description).substring(0, 150) + '...';
    }

    // Get time ago string
    getTimeAgo(pubDate) {
        if (!pubDate) return 'Recently';
        
        const now = new Date();
        const published = new Date(pubDate);
        const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    }

    // Update news in the hero slide
    async updateHeroNews() {
        try {
            console.log('Fetching RSS news...');
            const newsItems = await this.fetchAllFinancialNews();
            console.log('RSS news fetched:', newsItems.length, 'items');
            console.log('News items:', newsItems.map(item => item.title));
            
            // Ensure we have at least 6 news items for proper grid layout
            let formattedNews = this.formatNewsForDisplay(newsItems);
            
            // If we don't have enough news, supplement with fallback
            if (formattedNews.length < 6) {
                const fallbackNews = this.formatNewsForDisplay(this.getFallbackNews());
                const needed = 6 - formattedNews.length;
                formattedNews = [...formattedNews, ...fallbackNews.slice(0, needed)];
            }
            
            // Update the news grid section
            this.renderNewsItems(formattedNews);
        } catch (error) {
            console.error('Error updating hero news:', error);
            // Show fallback news
            const fallbackNews = this.formatNewsForDisplay(this.getFallbackNews());
            this.renderNewsItems(fallbackNews);
        }
    }

    // Render news items in the DOM
    renderNewsItems(newsItems) {
        const newsContainer = document.querySelector('#rss-news-container');
        if (!newsContainer) return;

        newsContainer.innerHTML = newsItems.map((item, index) => `
            <div class="news-card ${item.featured ? 'featured-news' : ''}" onclick="window.open('${item.url}', '_blank')" style="cursor: pointer;">
                <div class="news-image">
                    <img src="${this.getNewsImage(item.title, index)}" alt="${item.title}" onerror="this.style.display='none'">
                    <div class="news-overlay">
                        <span class="news-category">${this.getNewsCategory(item.title)}</span>
                    </div>
                </div>
                <div class="news-content">
                    <h3>${item.title}</h3>
                    ${item.featured ? `<p>${item.description}</p>` : ''}
                    <span class="news-time">${item.time}</span>
                </div>
            </div>
        `).join('');
    }

    // Get appropriate icon based on news title
    getNewsIcon(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('market') || titleLower.includes('nifty') || titleLower.includes('sensex')) {
            return 'chart-line';
        } else if (titleLower.includes('mutual fund') || titleLower.includes('sip')) {
            return 'coins';
        } else if (titleLower.includes('earnings') || titleLower.includes('corporate')) {
            return 'building';
        } else if (titleLower.includes('regulatory') || titleLower.includes('sebi')) {
            return 'shield-alt';
        } else if (titleLower.includes('global') || titleLower.includes('fed')) {
            return 'globe';
        }
        return 'newspaper';
    }

    // Get news image based on title and index
    getNewsImage(title, index) {
        const titleLower = title.toLowerCase();
        const imageUrls = [
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=150&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=150&fit=crop&crop=center'
        ];
        
        if (titleLower.includes('market') || titleLower.includes('nifty') || titleLower.includes('sensex')) {
            return 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&crop=center';
        } else if (titleLower.includes('mutual fund') || titleLower.includes('sip')) {
            return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=150&fit=crop&crop=center';
        } else if (titleLower.includes('earnings') || titleLower.includes('corporate')) {
            return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=150&fit=crop&crop=center';
        } else if (titleLower.includes('regulatory') || titleLower.includes('sebi')) {
            return 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=150&fit=crop&crop=center';
        } else if (titleLower.includes('global') || titleLower.includes('fed')) {
            return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=150&fit=crop&crop=center';
        }
        
        return imageUrls[index % imageUrls.length];
    }

    // Get news category based on title
    getNewsCategory(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('market') || titleLower.includes('nifty') || titleLower.includes('sensex')) {
            return 'Market Update';
        } else if (titleLower.includes('mutual fund') || titleLower.includes('sip')) {
            return 'MF Industry';
        } else if (titleLower.includes('earnings') || titleLower.includes('corporate')) {
            return 'Earnings';
        } else if (titleLower.includes('regulatory') || titleLower.includes('sebi')) {
            return 'Regulatory';
        } else if (titleLower.includes('global') || titleLower.includes('fed')) {
            return 'Global';
        }
        return 'Finance';
    }
}

// Initialize RSS service
window.rssService = new RSSService();

// Auto-update news every 10 minutes
setInterval(() => {
    if (window.rssService) {
        window.rssService.updateHeroNews();
    }
}, 10 * 60 * 1000);

// Update news on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.rssService) {
        // Show fallback news immediately
        const fallbackNews = window.rssService.formatNewsForDisplay(window.rssService.getFallbackNews());
        window.rssService.renderNewsItems(fallbackNews);
        
        // Then try to fetch real RSS news
        window.rssService.updateHeroNews();
    }
});
