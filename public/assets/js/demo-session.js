(function () {
    'use strict';

    const GUEST_AVATAR = '../public/assets/images/guest-avatar.svg';
    const DEFAULT_NAME = 'Guest';

    function getSession() {
        try {
            const raw = localStorage.getItem('tourgo_demo_session');
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function initializeCustomerIdentity() {
        const session = getSession();
        const name = session && session.role === 'customer' && session.name
            ? session.name
            : DEFAULT_NAME;

        document.querySelectorAll('.profile-toggle').forEach(function (toggle) {
            const avatar = toggle.querySelector('img');
            const nameElement = toggle.querySelector('span');

            if (avatar) {
                avatar.src = GUEST_AVATAR;
                avatar.alt = name + ' Profile';
            }

            if (nameElement) {
                nameElement.textContent = name;
            }
        });

        const headerAvatar = document.getElementById('headerAvatar');
        if (headerAvatar) {
            headerAvatar.src = GUEST_AVATAR;
            headerAvatar.alt = name + ' Profile';
        }

        const greeting = document.getElementById('customerNameGreeting');
        if (greeting) {
            greeting.textContent = name;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCustomerIdentity);
    } else {
        initializeCustomerIdentity();
    }
})();
