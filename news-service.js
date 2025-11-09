// News Service for Real-time Financial News
class NewsService {
    constructor() {
        this.apiKey = 'YOUR_NEWS_API_KEY'; // Replace with actual API key
        this.baseUrl = 'https://newsapi.org/v2';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Fetch financial news from NewsAPI
    async fetchFinancialNews() {
        try {
            const cacheKey = 'financial_news';
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }

            const response = await fetch(
                `${this.baseUrl}/everything?q=mutual+funds+OR+stocks+OR+market+OR+investment&language=en&sortBy=publishedAt&apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the results
            this.cache.set(cacheKey, {
                data: data.articles,
                timestamp: Date.now()
            });
            
            return data.articles;
        } catch (error) {
            console.error('Error fetching news:', error);
            return this.getFallbackNews();
        }
    }

    // Fetch Indian financial news specifically
    async fetchIndianFinancialNews() {
        try {
            const response = await fetch(
                `${this.baseUrl}/everything?q=NSE+OR+BSE+OR+mutual+funds+India&language=en&sortBy=publishedAt&apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error('Error fetching Indian news:', error);
            return this.getFallbackNews();
        }
    }

    // Fallback news when API fails
    getFallbackNews() {
        return [
            {
                title: "Market Rally Continues",
                description: "Nifty 50 gains 1.2% as banking stocks rally on strong Q3 results. HDFC Bank leads with 3.5% surge on robust earnings.",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                url: "#",
                source: { name: "Market Update" }
            },
            {
                title: "MF Industry Growth",
                description: "Mutual fund AUM crosses ₹50 lakh crore milestone, driven by strong SIP flows and equity market performance.",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                url: "#",
                source: { name: "Industry Report" }
            }
        ];
    }

    // Format news for display
    formatNewsForDisplay(articles) {
        return articles.slice(0, 6).map((article, index) => ({
            title: article.title,
            description: article.description || article.content,
            time: this.getTimeAgo(article.publishedAt),
            source: article.source.name,
            url: article.url,
            featured: index === 0
        }));
    }

    // Get time ago string
    getTimeAgo(publishedAt) {
        const now = new Date();
        const published = new Date(publishedAt);
        const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    }

    // Update news in the hero slide
    async updateHeroNews() {
        try {
            const articles = await this.fetchFinancialNews();
            const formattedNews = this.formatNewsForDisplay(articles);
            
            // Update the news preview section
            this.renderNewsItems(formattedNews);
        } catch (error) {
            console.error('Error updating hero news:', error);
        }
    }

    // Render news items in the DOM
    renderNewsItems(newsItems) {
        const newsPreview = document.querySelector('.news-preview');
        if (!newsPreview) return;

        newsPreview.innerHTML = newsItems.map((item, index) => `
            <div class="news-item ${item.featured ? 'featured' : ''}">
                <div class="news-icon">
                    <i class="fas fa-${this.getNewsIcon(item.title)}"></i>
                </div>
                <div class="news-content">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
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
}

// Initialize news service
window.newsService = new NewsService();

// Auto-update news every 5 minutes
setInterval(() => {
    if (window.newsService) {
        window.newsService.updateHeroNews();
    }
}, 5 * 60 * 1000);

// Update news on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.newsService) {
        window.newsService.updateHeroNews();
    }
});

