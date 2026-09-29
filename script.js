(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    // Mobile navigation
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('primary-navigation');
    const navSrOnly = navToggle ? navToggle.querySelector('.sr-only') : null;
    const navIcon = navToggle ? navToggle.querySelector('i') : null;

    function setNavOpen(open) {
        if (!navLinks || !navToggle) return;
        navLinks.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        if (navSrOnly) navSrOnly.textContent = open ? 'Close menu' : 'Open menu';
        if (navIcon) navIcon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            setNavOpen(!navLinks.classList.contains('is-open'));
        });
        navLinks.addEventListener('click', function (e) {
            if (e.target.closest('a')) setNavOpen(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setNavOpen(false);
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function currentTheme() {
        return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    }

    function syncThemeIcon() {
        if (!themeToggle) return;
        const dark = currentTheme() === 'dark';
        themeToggle.querySelector('i').className = dark ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            syncThemeIcon();
        });
        systemDark.addEventListener('change', syncThemeIcon);
        syncThemeIcon();
    }

    // Header border on scroll
    const header = document.getElementById('site-header');
    function onScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active nav link
    const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = sectionLinks
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                sectionLinks.forEach(function (a) {
                    a.classList.toggle('is-active', a.getAttribute('href') === id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { navObserver.observe(s); });
    }

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        const revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    // Project filters
    const filters = document.querySelectorAll('.filter');
    const projects = document.querySelectorAll('.project[data-cat]');
    filters.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const cat = btn.getAttribute('data-filter');
            filters.forEach(function (b) {
                const active = b === btn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-pressed', String(active));
            });
            projects.forEach(function (p) {
                p.hidden = cat !== 'all' && p.getAttribute('data-cat') !== cat;
                if (!p.hidden) p.classList.add('is-visible');
            });
        });
    });

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
