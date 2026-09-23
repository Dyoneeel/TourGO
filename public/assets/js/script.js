document.addEventListener('DOMContentLoaded', function() {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('mainNavMenu') || document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            // Toggle icon (bars <-> times)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        // Close nav menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Theme Toggle (Dark/Light) ---
    const themeToggle = document.querySelector('.theme-toggle');
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Update icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        }
        // Store preference
        localStorage.setItem('theme', theme);
        document.cookie = "theme=" + theme + ";path=/;max-age=" + (365 * 24 * 60 * 60);
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
    // Set initial theme from localStorage/cookie/system
    (function() {
        let theme = localStorage.getItem('theme');
        if (!theme) {
            const cookieTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
            if (cookieTheme) theme = cookieTheme.split('=')[1];
        }
        if (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = 'dark';
        }
        setTheme(theme || 'light');
    })();

    // --- Profile Dropdown ---
    const profileToggleBtn = document.getElementById('profileToggleBtn') || document.querySelector('.profile-toggle');
    const profileMenu = document.getElementById('profileMenu') || document.querySelector('.profile-menu');
    if (profileToggleBtn && profileMenu) {
        profileToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
            profileToggleBtn.classList.toggle('active');
        });
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (profileMenu.classList.contains('active') && !profileMenu.contains(e.target) && !profileToggleBtn.contains(e.target)) {
                profileMenu.classList.remove('active');
                profileToggleBtn.classList.remove('active');
            }
        });
        // Prevent closing when clicking inside
        profileMenu.addEventListener('click', function(e) { e.stopPropagation(); });
    }

    // --- Smooth Scroll for Internal Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                // Close mobile nav if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle && menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Sticky Header on Scroll ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Animate on Scroll for Cards/Steps/Testimonials ---
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step-item, .car-card, .testimonial-card');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    document.querySelectorAll('.step-item, .car-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
    });
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});

