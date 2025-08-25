// Encapsulate all functionality in a single object to avoid polluting the global scope.
const PortfolioApp = {
    // Configuration settings for various features.
    config: {
        animatedBackground: {
            baseIconCount: 20, // Base number of icons for mobile.
            iconsPerPixel: 0.025, // Additional icons per pixel of screen width.
            icons: [
                  'fab fa-python', 'fas fa-database', 'fab fa-html5', 'fab fa-css3-alt',
                            'fab fa-aws', 'fab fa-windows', 'fab fa-linux', 'fab fa-git-alt',
                            'fab fa-docker', 'fab fa-react', 'fab fa-raspberry-pi', 'fas fa-microchip',
                            'fas fa-code', 'fas fa-cloud', 'fas fa-cogs', 'fas fa-server',
                            'fab fa-js-square', 'fab fa-node-js'
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
        isFirstIconLoad: true // Track the initial creation of background icons
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
                // On first load, use a much smaller delay to make icons appear faster.
                const delay = this.state.isFirstIconLoad ? this.getRandom(0, 1) : this.getRandom(0, cfg.durationRange.max);
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

            // After the first run, set the flag to false.
            if (this.state.isFirstIconLoad) {
                this.state.isFirstIconLoad = false;
            }
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
        if (typedEl && typeof Typed !== 'undefined') {
            new Typed(typedEl, {
                strings: [
                    "Electronics and Telecommunication Engineer",
                    "Software Developer at Arya Omnitalk",
                    "IoT and AI Innovator",
                    "Python Enthusiast and Automation Expert",
                    "AI/ML Developer | Deep Learning Practitioner",
                    "Machine Learning Model Builder",
                    "OpenCV and Computer Vision Hobbyist",
                    "Building Smart Systems with Python",
                    "Exploring Generative AI and LLMs"
                ],
                typeSpeed: 50,
                backSpeed: 25,
                backDelay: 2000,
                startDelay: 500,
                loop: true,
                smartBackspace: true,   
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true
            });
        }
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

        // Animate on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
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
     * Handles the certification filter functionality with enhanced animations.
     */
    initCertFilter() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;

        const certItems = document.querySelectorAll('.cert-item');
        const certGrid = document.querySelector('.cert-grid'); // Assuming items are in a grid container

        // Add initial transition styles to items
        certItems.forEach(item => {
            item.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        });

        filterContainer.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.filter-btn');
            if (!targetButton || targetButton.classList.contains('active')) return;

            const filterValue = targetButton.dataset.filter;
            
            // Update active state on buttons
            filterContainer.querySelector('.active')?.classList.remove('active');
            targetButton.classList.add('active');

            // Animate items out
            certItems.forEach(item => {
                item.style.transform = 'scale(0.9)';
                item.style.opacity = '0';
            });

            // After the fade-out animation, filter and fade-in
            setTimeout(() => {
                certItems.forEach(item => {
                    const shouldShow = (filterValue === 'all' || item.dataset.category === filterValue);
                    
                    // Hide or show items based on the filter
                    if (shouldShow) {
                        item.style.display = ''; // Or 'block', 'flex', etc., depending on your layout
                        // We need a tiny delay for the browser to apply 'display' before starting the transition
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 20);
                    } else {
                        item.style.display = 'none';
                    }
                });
                // Optional: Trigger a layout recalculation if using a library like Isotope or Masonry
                // if (window.isotope) { certGrid.isotope('layout'); }
            }, 400); // This duration should match the CSS transition duration
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