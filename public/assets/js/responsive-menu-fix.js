(function () {
    'use strict';

    function initResponsiveMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.getElementById('mainNavMenu') || document.querySelector('.nav-menu');

        if (!menuToggle || !navMenu || menuToggle.dataset.tourgoMenuReady === 'true') {
            return;
        }

        menuToggle.dataset.tourgoMenuReady = 'true';
        menuToggle.setAttribute('role', 'button');
        menuToggle.setAttribute('tabindex', '0');
        menuToggle.setAttribute('aria-controls', navMenu.id || 'mainNavMenu');
        menuToggle.setAttribute('aria-expanded', 'false');

        function setIcon(open) {
            const icon = menuToggle.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-bars', !open);
            icon.classList.toggle('fa-times', open);
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            setIcon(false);
        }

        function openMenu() {
            navMenu.classList.add('active');
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            setIcon(true);
        }

        function toggleMenu() {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Capture phase makes this reliable even on pages that still contain
        // older inline/bundled click handlers from the PHP-to-static conversion.
        menuToggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            toggleMenu();
        }, true);

        menuToggle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggleMenu();
            }
        }, true);

        document.addEventListener('click', function (event) {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        }, true);

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResponsiveMenu, { once: true });
    } else {
        initResponsiveMenu();
    }
})();
