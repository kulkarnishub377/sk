// Encapsulate all functionality in a single object to avoid polluting the global scope.
const PortfolioApp = {
  // Configuration settings for various features.
  config: {
    scroll: {
      threshold: 0.1,
      progressThreshold: 0.5,
      navHighlightThreshold: 0.6,
    },
    theme: {
      default: "light", // Set default to light
      storageKey: "portfolio-theme",
    },
    debounceDelay: 250, // ms
  },

  // Application state.
  state: {
    isMobile: () => window.innerWidth < 768,
    reduceMotion: false,
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
   * Returns true when the user prefers reduced motion.
   */
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  /**
   * Adds an interactive spotlight effect to cards on mouse move.
   */
  initCardHoverEffect() {
    const enableTilt = !this.state.isMobile() && !this.state.reduceMotion;

    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        if (!enableTilt) return;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("transform");
      });
    });
  },

  /**
   * Initializes a typing animation for the hero subtitle.
   */
  initTypedJs() {
    const typedEl = document.querySelector(".hero-content .typed-text");
    if (typedEl && typeof Typed !== "undefined") {
      new Typed(typedEl, {
        strings: [
        "AI/ML Engineer | Computer Vision Specialist",
        "Building Production AI Systems at Scale",
        "YOLOv8 · TensorRT · Edge AI · DeepSORT",
        "Smart India Hackathon 2023 — AIR 1 Winner",
        "Python · PyTorch · OpenCV · LangChain",
        "Full-Stack AI: Django · React · FastAPI",
        "50,000+ Vehicles Processed Daily on Indian Highways",
        "From Jupyter Notebooks to Production Pipelines",
      ],
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        smartBackspace: true,
        showCursor: true,
        cursorChar: "|",
        autoInsertCss: true,
      });
    }
  },


  /**
   * Adds pointer-reactive ambient movement to the hero background layers.
   */
  initHeroAmbientMotion() {
    if (this.state.reduceMotion) return;

    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    let raf;
    heroSection.addEventListener("mousemove", (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroSection.style.setProperty("--hero-pointer-x", `${x.toFixed(2)}%`);
        heroSection.style.setProperty("--hero-pointer-y", `${y.toFixed(2)}%`);
      });
    });

    heroSection.addEventListener("mouseleave", () => {
      heroSection.style.setProperty("--hero-pointer-x", "50%");
      heroSection.style.setProperty("--hero-pointer-y", "50%");
    });
  },

  /**
   * Initializes Intersection Observers for scroll-triggered animations.
   */
  initScrollAnimations() {
    const animateOnScrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.add("is-visible");
            animateOnScrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: this.config.scroll.threshold },
    );

    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => animateOnScrollObserver.observe(el));

    // Fallback: force all animate-on-scroll elements visible after 3s
    // in case IntersectionObserver doesn't fire (e.g. already in viewport)
    setTimeout(() => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        el.classList.add("visible");
        el.classList.add("is-visible");
      });
    }, 3000);
  },

  /**
   * Sets up smooth scrolling for navigation links and closes the mobile menu on click.
   */
  initSmoothScroll() {
    document
      .querySelectorAll('.navbar-nav .nav-link[href^="#"]:not([data-bs-toggle])')
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            // Close Bootstrap mobile menu if open
            const navbarCollapseEl = document.getElementById("navbarNav");
            if (navbarCollapseEl?.classList.contains("show")) {
              const bsCollapse = new bootstrap.Collapse(navbarCollapseEl);
              bsCollapse.hide();
            }
            const navHeight =
              document.querySelector(".navbar")?.offsetHeight || 0;
            const top =
              targetElement.getBoundingClientRect().top +
              window.scrollY -
              navHeight -
              8;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      });
  },

  /**
   * Highlights the active navigation link based on the current scroll position.
   */
  initNavHighlighting() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(
      '.navbar-nav .nav-link[href^="#"]',
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${id}`,
              );
            });
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
  },

  /**
   * Adds a class to the navbar when the page is scrolled.
   */
  initNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const scrollHandler = () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", this.debounce(scrollHandler, 50));
    scrollHandler(); // Run on load
  },

  /**
   * Shows/hides the "back to top" button based on scroll position.
   */
  initBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    const scrollHandler = () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", this.debounce(scrollHandler, 100));

    backToTopButton.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  },

  /**
   * Adds a dynamic scroll progress indicator in the navbar.
   */
  initScrollProgress() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    navbar.appendChild(progress);

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, ratio))}%`;
    };

    window.addEventListener("scroll", this.debounce(onScroll, 20));
    onScroll();
  },

  /**
   * Sets the current year in the footer.
   */
  initCopyrightYear() {
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  },

    /**
     * Initializes social share functionality for blog posts.
     */
    initBlogShare() {
        // Use event delegation for better performance and handling dynamic content
        document.addEventListener('click', (e) => {
            // Find closest share button if clicked specific icon
            const btn = e.target.closest('.share-btn') || e.target.closest('.copy-link-btn');
            if (!btn) return;

            // Stop propagation to prevent card click (stretched-link issues)
            e.stopPropagation(); 
            // Prevent default anchor behavior
            e.preventDefault();

            const platform = btn.dataset.platform;
            
            // --- DYNAMIC DATA RETRIEVAL ---
            let url = window.location.href;
            let title = document.title;
            const isCopyLink = btn.classList.contains('copy-link-btn') || btn.classList.contains('copy-link');

            // 1. Try explicit data attributes on the button
            if (btn.dataset.url) url = btn.dataset.url;
            if (btn.dataset.title) title = btn.dataset.title;

            // 2. Try looking up the DOM tree for an article card (Context Aware)
            const card = btn.closest('.article-card') || btn.closest('.card'); // Added generic .card support for Main Index
            if (card) {
                const linkElement = card.querySelector('a.stretched-link') || card.querySelector('h3 a') || card.querySelector('.card-body a[href^="blog/"]');
                const titleElement = card.querySelector('.card-heading') || card.querySelector('.card-title');
                
                if (linkElement) {
                    // Resolve relative URLs to absolute
                    url = new URL(linkElement.getAttribute('href'), window.location.href).href;
                }
                if (titleElement) {
                    title = titleElement.innerText.trim();
                }
            }

            // --- LOCALHOST FIX FOR LINKEDIN PREVIEWS ---
            // LinkedIn cannot scrape localhost. We replace it with the production URL for testing.
            if (url.includes('localhost') || url.includes('127.0.0.1')) {
                // Assuming the structure matches the repo path or at least the domain
                // Replace local origin with production origin
                const prodOrigin = 'https://kulkarnishub377.github.io/sk';
                
                // Flexible replacement: remove everything up to '/sk/' or '/portfolio/' if present, or just swap origin
                if (url.includes('/sk/')) {
                    const path = url.split('/sk/')[1];
                    url = `${prodOrigin}/${path}`;
                } else {
                    // Fallback: try to map roughly
                    const path = new URL(url).pathname; // e.g., /blog/ai-ml-trends.html
                    url = `${prodOrigin}${path}`;
                }
                console.log('Localhost detected. Sharing production URL:', url);
            }

            // Encode for URL parameters
            const encodedUrl = encodeURIComponent(url);
            const encodedTitle = encodeURIComponent(title);
            let shareUrl = '';

            // Handle Copy Link separately
            if (isCopyLink) {
                 this.copyToClipboard(url, btn);
                 return;
            }

            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    },

    /**
     * Helper to copy text to clipboard with feedback
     */
    async copyToClipboard(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual Feedback
            const originalHTML = btn.innerHTML;
            const isSmall = btn.classList.contains('share-btn-sm');
            
            // Minimal feedback for small buttons
            if (isSmall) {
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.classList.add('text-success');
            } else {
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.classList.add('btn-success'); 
            }
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('btn-success');
                btn.classList.remove('text-success');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    },

  /**
   * Hides the preloader once the window is fully loaded.
   */
  initPreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      window.addEventListener("load", () => {
        preloader.classList.add("hidden");
      });
    }
  },

  /**
   * Initializes certification rendering with Load More/Show Less functionality.
   */
  initCertifications() {
    const certifications = [
      {
        title: 'Career Essentials in Generative AI',
        issuer: 'Microsoft',
        date: 'Sep 2023',
        link: 'https://www.linkedin.com/learning/certificates/945343f8575e0958170e8038fbcd6a8166106a24ee9b329e1ac77714289ac0f0',
        icon: 'fab fa-microsoft',
        category: ['ai']
      },
      {
        title: 'Deep Learning Onramp',
        issuer: 'MathWorks',
        date: 'Aug 2023',
        link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=12dd9cad7-1d2c-4b4b-91b7-beeda802f680&',
        icon: 'fas fa-robot',
        category: ['matlab', 'ai']
      },
      {
        title: 'Machine Learning Onramp',
        issuer: 'MathWorks',
        date: 'Aug 2023',
        link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=2c86c398-7a86-4d7d-95e5-9c7f70362202&',
        icon: 'fas fa-robot',
        category: ['matlab', 'ai']
      },
      {
        title: 'What is Data Science?',
        issuer: 'IBM',
        date: 'Mar 2023',
        link: 'https://www.coursera.org/account/accomplishments/certificate/BTKY4E35PW5Z',
        icon: 'fas fa-database',
        category: ['data']
      },
      {
        title: 'Image Processing Onramp',
        issuer: 'MathWorks',
        date: 'Jul 2023',
        link: 'https://matlabacademy.mathworks.com/progress/share/certificate.html?id=0fdab258-1727-4ad4-a074-7c5cea443ec8&',
        icon: 'fas fa-image',
        category: ['matlab']
      },
      {
        title: 'Postman API Fundamentals Student Expert',
        issuer: 'Postman',
        date: 'May 2024',
        link: 'https://api.badgr.io/public/assertions/GLDMnLdNRiWFWW0DbvzBDw',
        icon: 'fas fa-rocket',
        category: ['api', 'programming']
      },
      {
        title: 'A.I. for India 2.0',
        issuer: 'HCL GUVI',
        date: 'Aug 2023',
        link: 'https://www.guvi.in/verify-certificate?id=vp07016N8b16X9S192&course=ai_for_in_mar',
        icon: 'fas fa-brain',
        category: ['ai']
      },
      {
        title: 'Geodata Processing using Python',
        issuer: 'ISRO',
        date: 'Jan 2024',
        link: 'https://www.linkedin.com/in/shubhkulk21/details/certifications/1709784096382/single-media-viewer?type=IMAGE&profileId=ACoAAD_RI18BIVyTeFPNykfkkxOCzmq8iTPELno',
        icon: 'fab fa-python',
        category: ['python', 'data']
      },
      {
        title: 'Geospatial Analysis using Google Earth Engine',
        issuer: 'ISRO',
        date: 'N/A',
        link: 'https://drive.google.com/file/d/13qAyJBVKxWHpG2FTyF2gGBZjdrZU9z6U/view?usp=drivesdk',
        icon: 'fas fa-globe-asia',
        category: ['data']
      },
      {
        title: 'Overview of Global Navigation Satellite System',
        issuer: 'ISRO',
        date: 'Dec 2023',
        link: 'https://drive.google.com/file/d/1jMDc_po_n-aW2sIxlm8s28NZSTEupbX4/view?usp=drivesdk',
        icon: 'fas fa-satellite-dish',
        category: ['networking', 'data']
      }
    ];

    const certGrid = document.getElementById('certifications-grid');
    const loadMoreBtn = document.getElementById('load-more-cert-btn');
    const showLessBtn = document.getElementById('show-less-cert-btn');
    
    if (!certGrid) return;

    let certsToShow = 6;

    const renderCertifications = () => {
      certGrid.innerHTML = '';
      certifications.slice(0, certsToShow).forEach(cert => {
        certGrid.innerHTML += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <div class="mb-3 text-primary">
                <i class="${cert.icon} fa-2x" aria-hidden="true"></i>
              </div>
              <h5 class="card-title mb-1">${cert.title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${cert.issuer}</h6>
              <p class="mb-2"><small class="text-muted">${cert.date}</small></p>
              <a href="${cert.link}" class="btn btn-gradient btn-sm mt-auto" target="_blank" rel="noopener">View Certificate</a>
            </div>
          </div>
        </div>
        `;
      });
      
      if (certsToShow >= certifications.length) {
        loadMoreBtn.classList.add('d-none');
      } else {
        loadMoreBtn.classList.remove('d-none');
      }
      
      if (certsToShow > 6) {
        showLessBtn.classList.remove('d-none');
      } else {
        showLessBtn.classList.add('d-none');
      }
    };

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        certsToShow = Math.min(certsToShow + 6, certifications.length);
        renderCertifications();
      });
    }

    if (showLessBtn) {
      showLessBtn.addEventListener('click', () => {
        certsToShow = 6;
        renderCertifications();
      });
    }

    renderCertifications();
  },

  /**
   * Initializes dark/light theme toggle functionality.
   */
  initThemeToggle() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    if (!themeToggle) return;

    // Load saved theme or set default
    const saved = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-bs-theme', saved);
    
    if (themeIcon) {
      themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-bs-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-bs-theme', next);
      localStorage.setItem('portfolio-theme', next);
      
      if (themeIcon) {
        themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    });
  },

  /**
   * Initializes all components of the application.
   */
  init() {
    this.initPreloader();
    // Execute initialization methods when the DOM is fully loaded.
    document.addEventListener("DOMContentLoaded", () => {
      this.state.reduceMotion = this.prefersReducedMotion();
      if (this.state.reduceMotion) {
        document.body.classList.add("reduced-motion");
      }
      this.initCardHoverEffect();
      this.initCertifications();
      this.initThemeToggle();
      this.initTypedJs();
      this.initHeroAmbientMotion();
      this.initScrollAnimations();
      this.initSmoothScroll();
      this.initNavHighlighting();
      this.initNavbarScroll();
      this.initBackToTopButton();
      this.initScrollProgress();
      this.initBlogShare();
      this.initCopyrightYear();
      console.log("Portfolio App Initialized");
    });
  },
};

// Start the application.
PortfolioApp.init();
