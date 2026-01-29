/**
 * Blog-specific JavaScript functionality
 * Handles search, filtering, social sharing, and interactive features
 */

const BlogApp = {
    // Configuration
    config: {
        animationDelay: 100,
        searchDelay: 300
    },

    // State
    state: {
        currentFilter: 'all',
        searchTerm: ''
    },

    /**
     * Initialize all blog features
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initSearch();
            this.initFilter();
            this.initSocialShare();
            this.initReadingTime();
            this.initScrollProgress();
            this.initCopyLink();
            this.animateBlogCards();
            console.log('Blog App Initialized');
        });
    },

    /**
     * Debounce utility function
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Initialize blog search functionality
     */
    initSearch() {
        const searchInput = document.querySelector('.blog-search-input');
        if (!searchInput) return;

        const performSearch = this.debounce(() => {
            this.state.searchTerm = searchInput.value.toLowerCase();
            this.filterBlogCards();
        }, this.config.searchDelay);

        searchInput.addEventListener('input', performSearch);
    },

    /**
     * Initialize category filter
     */
    initFilter() {
        const filterButtons = document.querySelectorAll('.blog-filter-btn');
        if (!filterButtons.length) return;

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Update filter state
                this.state.currentFilter = e.target.dataset.filter;
                this.filterBlogCards();
            });
        });
    },

    /**
     * Filter blog cards based on search and category
     */
    filterBlogCards() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            const category = card.dataset.category || '';
            const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
            
            // Check category filter
            const categoryMatch = this.state.currentFilter === 'all' || 
                                 category === this.state.currentFilter;
            
            // Check search filter
            const searchMatch = !this.state.searchTerm || 
                               title.includes(this.state.searchTerm) || 
                               excerpt.includes(this.state.searchTerm);
            
            // Show/hide card
            if (categoryMatch && searchMatch) {
                card.style.display = '';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    },

    /**
     * Initialize social sharing buttons
     */
    initSocialShare() {
        const shareButtons = document.querySelectorAll('[data-share]');
        
        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = btn.dataset.share;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                let shareUrl = '';
                
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    },

    /**
     * Copy link to clipboard
     */
    initCopyLink() {
        const copyBtn = document.querySelector('[data-share="copy"]');
        if (!copyBtn) return;

        copyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await navigator.clipboard.writeText(window.location.href);
                
                // Visual feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#48bb78';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    },

    /**
     * Calculate and display reading time
     */
    initReadingTime() {
        const content = document.querySelector('.blog-post-content');
        const readTimeElement = document.querySelector('.blog-reading-time');
        
        if (!content || !readTimeElement) return;

        const text = content.textContent;
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        readTimeElement.textContent = `${readingTime} min read`;
    },

    /**
     * Initialize scroll progress bar
     */
    initScrollProgress() {
        const progressBar = document.querySelector('.blog-scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    },

    /**
     * Animate blog cards on load
     */
    animateBlogCards() {
        const cards = document.querySelectorAll('.blog-card');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('blog-card-animate');
            }, index * this.config.animationDelay);
        });
    },

    /**
     * Format date to readable format
     */
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    /**
     * Handle newsletter subscription
     */
    initNewsletter() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('.newsletter-input').value;
            const btn = form.querySelector('.newsletter-btn');
            
            // Validate email
            if (!this.validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Mock submission (replace with actual API call)
            btn.textContent = 'Subscribing...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Subscribed!';
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    },

    /**
     * Validate email format
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Initialize table of contents
     */
    initTableOfContents() {
        const content = document.querySelector('.blog-post-content');
        const tocContainer = document.querySelector('.blog-toc');
        
        if (!content || !tocContainer) return;

        const headings = content.querySelectorAll('h2, h3');
        if (!headings.length) return;

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.id = id;

            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = heading.tagName === 'H3' ? 'toc-sub-item' : 'toc-item';
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
            });

            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });

        tocContainer.appendChild(tocList);
    }
};

// Initialize the blog app
BlogApp.init();
