// Encapsulate all functionality in a single object to avoid polluting the global scope.
const PortfolioApp = {
    // Configuration settings for various features.
    config: {
        animatedBackground: {
            baseIconCount: 20, // Base number of icons for mobile.
            iconsPerPixel: 0.025, // Additional icons per pixel of screen width.
            icons: [
                'fab fa-html5', 'fab fa-css3-alt', 'fab fa-js-square', 'fab fa-react',
                'fab fa-node-js', 'fab fa-python', 'fas fa-database', 'fas fa-server',
                'fas fa-code', 'fas fa-microchip', 'fab fa-git-alt', 'fab fa-bootstrap',
                'fab fa-docker', 'fab fa-aws', 'fas fa-cogs', 'fas fa-cloud', 'fab fa-github'
            ],
            colors: [ // Palette for colorful icons
                '#00A8E8', '#0077B6', '#48CAE4', '#90E0EF', '#ADE8F4', '#0096C7'
            ],
            sizeRange: { min: 1.5, max: 3.5 }, // in rem
            durationRange: { min: 5, max: 12 }, // Slower, more subtle animation
            opacityRange: { min: 0.05, max: 0.4 },
            interaction: { // Config for mouse interaction
                radius: 150, // pixels
                pushFactor: 0.8 // how strongly icons are pushed away
            }
        },
        scroll: {
            threshold: 0.1,
            progressThreshold: 0.5,
            navHighlightThreshold: 0.6
        },
        theme: {
            default: 'light', // Set default to light
            storageKey: 'portfolio-theme'
        },
        debounceDelay: 250 // ms
    },

    // Application state.
    state: {
        isMobile: () => window.innerWidth < 768,
    },

    /**
     * Utility function to get a random number in a range.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} A random number between min and max.
     */
    getRandom: (min, max) => Math.random() * (max - min) + min,

    /**
     * Utility function to debounce a function.
     * @param {Function} func - The function to debounce.
     * @param {number} delay - The debounce delay in milliseconds.
     * @returns {Function} The debounced function.
     */
    debounce(func, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Initializes a floating, fading background of tech icons.
     * This version is responsive and adjusts the number of icons based on screen width.
     */
    initAnimatedBackground() {
        const background = document.querySelector('.tech-background');
        if (!background) return;

        const createIcons = () => {
            background.innerHTML = ''; // Clear existing icons
            const cfg = this.config.animatedBackground;
            const iconCount = Math.floor(cfg.baseIconCount + window.innerWidth * cfg.iconsPerPixel);

            const fragment = document.createDocumentFragment();
            for (let i = 0; i < iconCount; i++) {
                const icon = document.createElement('i');
                const iconClass = cfg.icons[Math.floor(Math.random() * cfg.icons.length)];
                const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
                
                icon.className = `tech-icon ${iconClass}`;
                
                const duration = this.getRandom(cfg.durationRange.min, cfg.durationRange.max);
                const delay = this.getRandom(0, cfg.durationRange.max);
                const floatDuration = this.getRandom(4, 8);
                
                icon.style.fontSize = `${this.getRandom(cfg.sizeRange.min, cfg.sizeRange.max)}rem`;
                icon.style.top = `${this.getRandom(-10, 110)}%`;
                icon.style.left = `${this.getRandom(-10, 110)}%`;
                icon.style.color = color;
                icon.style.textShadow = `0 0 15px ${color}60`; // Add a subtle glow with 60% opacity
                icon.style.animationDuration = `${duration}s, ${floatDuration}s`;
                icon.style.animationDelay = `${delay}s`;
                icon.style.setProperty('--max-opacity', this.getRandom(cfg.opacityRange.min, cfg.opacityRange.max));
                
                fragment.appendChild(icon);
            }
            background.appendChild(fragment);
        };

        createIcons();
        // Recreate icons on resize to adjust density, but debounced for performance.
        window.addEventListener('resize', this.debounce(createIcons, this.config.debounceDelay));
    },

    /**
     * Adds an interactive spotlight effect to cards on mouse move.
     */
    initCardHoverEffect() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    },

    /**
     * Initializes a typing animation for the hero subtitle.
     */
    initTypedJs() {
        const typedEl = document.querySelector('.hero-content .typed-text');
        
        if (!typedEl) {
            console.warn('Typed.js: Target element ".hero-content .typed-text" not found.');
            return;
        }

        if (typeof window.Typed === 'undefined') {
            console.error('Typed.js library is not loaded. Please make sure the script is included.');
            // As a fallback, set the first text content directly.
            const fallbackText = "Electronics & Telecommunication Engineer";
            typedEl.textContent = fallbackText;
            return;
        }

        // Clear the element to prevent a flash of the full text before typing begins.
        typedEl.textContent = '';

        // Ensure the parent has a minimum height to prevent layout shifts during typing.
        const parent = typedEl.parentElement;
        if (parent && !parent.style.minHeight) {
            parent.style.minHeight = parent.offsetHeight + 'px';
        }

        // Use strings from the data attribute or a default set.
        const strings = typedEl.dataset.typedStrings 
            ? JSON.parse(typedEl.dataset.typedStrings)
            : [
                "Electronics & Telecommunication Engineer",
                "Jr. Software Developer",
                "A Full-Stack Enthusiast",
                "An IoT & AI Innovator"
              ];

        new window.Typed(typedEl, {
            strings: strings,
            typeSpeed: 50,       // Slightly faster typing speed
            backSpeed: 25,       // Slightly slower backspacing
            backDelay: 2000,     // Pause before backspacing
            startDelay: 500,     // Initial delay
            loop: true,
            smartBackspace: true,// Backspace only what's needed
            fadeOut: true,       // Add a fade-out effect
            fadeOutClass: 'typed-fade-out', // CSS class for fade animation
            fadeOutDelay: 500,   // Time for the fade-out effect
            cursorChar: '|',     // A more common cursor character
            autoInsertCss: true  // Let Typed.js inject its default CSS for the cursor
        });
    },

    /**
     * Initializes mouse-move interaction for the hero background.
     * Icons near the cursor will be pushed away.
     */
    initBackgroundInteraction() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const cfg = this.config.animatedBackground.interaction;

        heroSection.addEventListener('mousemove', (e) => {
            const icons = document.querySelectorAll('.tech-icon');
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            icons.forEach(icon => {
                const iconRect = icon.getBoundingClientRect();
                const iconCenterX = iconRect.left + iconRect.width / 2;
                const iconCenterY = iconRect.top + iconRect.height / 2;

                const dx = mouseX - iconCenterX;
                const dy = mouseY - iconCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < cfg.radius) {
                    const angle = Math.atan2(dy, dx);
                    const pushDistance = (cfg.radius - distance) * cfg.pushFactor;
                    const translateX = -Math.cos(angle) * pushDistance;
                    const translateY = -Math.sin(angle) * pushDistance;
                    icon.style.transform = `translate(${translateX}px, ${translateY}px)`;
                } else {
                    icon.style.transform = 'translate(0, 0)';
                }
            });
        });

        heroSection.addEventListener('mouseleave', () => {
             document.querySelectorAll('.tech-icon').forEach(icon => {
                icon.style.transform = 'translate(0, 0)';
             });
        });
    },

    /**
     * Initializes Intersection Observers for scroll-triggered animations.
     */
    initScrollAnimations() {
        const animateOnScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateOnScrollObserver.unobserve(entry.target);
                }
            });
        }, { threshold: this.config.scroll.threshold });

        document.querySelectorAll('.animate-on-scroll').forEach(el => animateOnScrollObserver.observe(el));

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        progressBar.style.width = `${progressBar.dataset.progress}%`;
                    }
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: this.config.scroll.progressThreshold });

        document.querySelectorAll('.skill-item').forEach(item => progressObserver.observe(item));
    },

    /**
     * Sets up smooth scrolling for navigation links and closes the mobile menu on click.
     */
    initSmoothScroll() {
        document.querySelectorAll('.navbar-nav .nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close Bootstrap mobile menu if open
                    const navbarCollapseEl = document.getElementById('navbarNav');
                    if (navbarCollapseEl?.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapseEl);
                        bsCollapse.hide();
                    }
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    },

    /**
     * Highlights the active navigation link based on the current scroll position.
     */
    initNavHighlighting() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    },

    /**
     * Handles the certification filter functionality.
     */
    initCertFilter() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;

        const certItems = document.querySelectorAll('.cert-item');

        filterContainer.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.filter-btn');
            if (!targetButton) return;

            const filterValue = targetButton.dataset.filter;
            
            filterContainer.querySelector('.active')?.classList.remove('active');
            targetButton.classList.add('active');

            certItems.forEach(item => {
                const shouldShow = (filterValue === 'all' || item.dataset.category === filterValue);
                item.classList.toggle('hidden', !shouldShow);
            });
        });
    },

    /**
     * Handles the contact form submission with user feedback.
     */
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const formStatus = document.getElementById('formAlert'); // Corrected ID

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            contactForm.classList.add('was-validated');

            if (!contactForm.checkValidity()) {
                return;
            }

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            formStatus.textContent = '';
            formStatus.className = 'alert';
            formStatus.style.display = 'none';

            try {
                // This is a mock submission. Replace with your actual form submission endpoint.
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Mock success
                formStatus.textContent = "Thank you for your message! I'll get back to you soon.";
                formStatus.className = 'alert alert-success';
                formStatus.style.display = 'block';
                contactForm.reset();
                contactForm.classList.remove('was-validated');

            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                formStatus.className = 'alert alert-danger';
                formStatus.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }
        });
    },

    /**
     * Adds a class to the navbar when the page is scrolled.
     */
    initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const scrollHandler = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', this.debounce(scrollHandler, 50));
        scrollHandler(); // Run on load
    },

    /**
     * Shows/hides the "back to top" button based on scroll position.
     */
    initBackToTopButton() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;

        const scrollHandler = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', this.debounce(scrollHandler, 100));

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    /**
     * Sets the current year in the footer.
     */
    initCopyrightYear() {
        const yearSpan = document.getElementById('copyright-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    },

    /**
     * Hides the preloader once the window is fully loaded.
     */
    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.classList.add('hidden');
            });
        }
    },

    /**
     * Initializes all components of the application.
     */
    init() {
        this.initPreloader();
        // Execute initialization methods when the DOM is fully loaded.
        document.addEventListener('DOMContentLoaded', () => {
            this.initAnimatedBackground();
            this.initCardHoverEffect();
            this.initTypedJs();
            this.initBackgroundInteraction();
            this.initScrollAnimations();
            this.initSmoothScroll();
            this.initNavHighlighting();
            this.initCertFilter();
            this.initContactForm();
            this.initNavbarScroll(); // Added navbar scroll handler
            this.initBackToTopButton();
            this.initCopyrightYear();
            console.log("Portfolio App Initialized");
        });
    }
};

// Start the application.
PortfolioApp.init();