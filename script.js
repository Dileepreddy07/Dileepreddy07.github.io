(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('primary-navigation');
    const navSrOnly = navToggle ? navToggle.querySelector('.sr-only') : null;

    function closeMobileNav() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navSrOnly) navSrOnly.textContent = 'Open menu';
    }

    function openMobileNav() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        if (navSrOnly) navSrOnly.textContent = 'Close menu';
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            if (navLinks.classList.contains('is-open')) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileNav();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (!id || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            closeMobileNav();
        });
    });

    window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (!nav) return;
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(function (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease-out';
            observer.observe(section);
        });

        document.querySelectorAll('.project-card').forEach(function (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });

        document.querySelectorAll('.skill-category').forEach(function (category) {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            category.style.transition = 'all 0.6s ease-out';
            observer.observe(category);
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            console.log('Form submitted:', data);
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }

    function createParticle() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 20 + 10;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.animationDelay = Math.random() * 5 + 's';
        hero.appendChild(particle);
    }

    if (!prefersReducedMotion) {
        for (let i = 0; i < 5; i++) {
            createParticle();
        }
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });

        scrollIndicator.addEventListener('click', function () {
            window.scrollTo({
                top: window.innerHeight,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }
})();
