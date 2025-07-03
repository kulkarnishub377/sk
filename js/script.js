// Add your custom JavaScript here

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Initializes a floating, fading background of tech icons in the hero section.
     */
    const initAnimatedBackground = () => {
        const background = document.querySelector('.tech-background');
        if (!background) return;

        // Clear existing icons to prevent duplication
        background.innerHTML = '';

        const config = {
            iconCount: 40,
            icons: [
                'fab fa-html5', 'fab fa-css3-alt', 'fab fa-js-square', 'fab fa-react',
                'fab fa-node-js', 'fab fa-python', 'fas fa-database', 'fas fa-server',
                'fas fa-code', 'fas fa-microchip', 'fab fa-git-alt', 'fab fa-bootstrap',
                'fab fa-docker', 'fab fa-aws', 'fas fa-cogs', 'fas fa-cloud', 'fab fa-github'
            ],
            sizeRange: { min: 1.5, max: 3.5 }, // in rem
            durationRange: { min: 3, max: 8 },
            opacityRange: { min: 0.1, max: 0.5 }
        };

        const getRandom = (min, max) => Math.random() * (max - min) + min;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < config.iconCount; i++) {
            const icon = document.createElement('i');
            const iconClass = config.icons[Math.floor(Math.random() * config.icons.length)];
            
            icon.className = `tech-icon ${iconClass}`;
            
            const duration = getRandom(config.durationRange.min, config.durationRange.max);
            const delay = getRandom(0, config.durationRange.max);
            
            icon.style.fontSize = `${getRandom(config.sizeRange.min, config.sizeRange.max)}rem`;
            icon.style.top = `${getRandom(-5, 105)}%`;
            icon.style.left = `${getRandom(-5, 105)}%`;
            icon.style.animation = `fadeInOut ${duration}s ease-in-out ${delay}s infinite`;
            icon.style.setProperty('--max-opacity', getRandom(config.opacityRange.min, config.opacityRange.max));
            
            fragment.appendChild(icon);
        }
        background.appendChild(fragment);
    };

    /**
     * Initializes Intersection Observers for scroll-triggered animations.
     */
    const initScrollAnimations = () => {
        const animateOnScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateOnScrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => animateOnScrollObserver.observe(el));

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        const progress = progressBar.getAttribute('data-progress');
                        progressBar.style.width = `${progress}%`;
                    }
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-item').forEach(item => progressObserver.observe(item));
    };

    /**
     * Sets up smooth scrolling for navigation links and closes the mobile menu on click.
     */
    const initSmoothScroll = () => {
        document.querySelectorAll('.navbar-nav .nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbarCollapseEl = document.getElementById('navbarNav');
                    if (navbarCollapseEl && navbarCollapseEl.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapseEl, { toggle: false });
                        bsCollapse.hide();
                    }
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    /**
     * Handles the certification filter functionality.
     */
    const initCertFilter = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const certItems = document.querySelectorAll('.cert-item');
        if (filterButtons.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                certItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const shouldShow = (filterValue === 'all' || itemCategory === filterValue);
                    item.classList.toggle('hidden', !shouldShow);
                });
            });
        });
    };

    /**
     * Handles the contact form submission with user feedback.
     */
    const initContactForm = () => {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formAlert = document.getElementById('formAlert');
            formAlert.innerHTML = `<div class="alert alert-success" role="alert">Thank you for your message! I will get back to you soon.</div>`;
            this.reset();
            setTimeout(() => {
                formAlert.innerHTML = '';
            }, 5000);
        });
    };

    /**
     * Sets the copyright year in the footer.
     */
    const setCopyrightYear = () => {
        const yearSpan = document.getElementById('copyright-year');
        if(yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    /**
     * Handles the theme toggling functionality.
     */
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        const body = document.body;
        const themeIcon = themeToggle.querySelector('i');

        const applyTheme = (theme) => {
            if (theme === 'light') {
                body.classList.add('light-theme');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                body.classList.remove('light-theme');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        };

        themeToggle.addEventListener('click', () => {
            const isLightTheme = body.classList.toggle('light-theme');
            const newTheme = isLightTheme ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
        applyTheme(savedTheme);
    };

    // Initialize all functionalities
    initAnimatedBackground();
    initScrollAnimations();
    initSmoothScroll();
    initCertFilter();
    initContactForm();
    setCopyrightYear();
    initThemeToggle();
});