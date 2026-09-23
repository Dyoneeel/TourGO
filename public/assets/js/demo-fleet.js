(function (window) {
    const fleet = [
        { id: 1, make: 'Toyota', model: 'Vios', type: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline', seats: 5, price: 2500, year: 2024, image: 'car.png', description: 'A practical and comfortable sedan for city trips, business travel, and everyday adventures.', doors: 4, mileage: 'Unlimited', color: 'Pearl White' },
        { id: 2, make: 'Honda', model: 'City', type: 'Sedan', transmission: 'CVT', fuel: 'Gasoline', seats: 5, price: 3000, year: 2024, image: 'car.png', description: 'A refined compact sedan with a smooth CVT transmission and a comfortable interior.', doors: 4, mileage: 'Unlimited', color: 'Modern Steel' },
        { id: 3, make: 'Mitsubishi', model: 'Xpander', type: 'MPV', transmission: 'Automatic', fuel: 'Gasoline', seats: 7, price: 4500, year: 2025, image: 'car.png', description: 'A spacious 7-seater MPV built for family trips and group travel with flexible cabin space.', doors: 5, mileage: 'Unlimited', color: 'Quartz White' },
        { id: 4, make: 'Toyota', model: 'Fortuner', type: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 7, price: 5500, year: 2025, image: 'car.png', description: 'A spacious premium SUV with 7 seats, diesel power, and confident road presence.', doors: 5, mileage: 'Unlimited', color: 'Silver Metallic' }
    ];

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, function (char) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char];
        });
    }

    function getFavorites() {
        try {
            const parsed = JSON.parse(localStorage.getItem('tourgo_favorites') || '[]');
            return Array.isArray(parsed) ? parsed.map(Number) : [];
        } catch (_) {
            return [];
        }
    }

    function setFavorites(ids) {
        localStorage.setItem('tourgo_favorites', JSON.stringify(ids));
    }

    function cardHtml(vehicle, options) {
        const imagePrefix = options.imagePrefix || '';
        const detailsPrefix = options.detailsPrefix || 'car_details.html';
        const showWishlist = options.showWishlist !== false;
        const favorites = getFavorites();
        const isFavorite = favorites.includes(vehicle.id);
        const detailsHref = detailsPrefix.indexOf('?') === -1
            ? detailsPrefix + '?id=' + vehicle.id
            : detailsPrefix + '&id=' + vehicle.id;
        return `
            <div class="car-card" data-vehicle-id="${vehicle.id}">
                <div class="car-image">
                    <span class="car-type">${escapeHtml(vehicle.type)}</span>
                    ${showWishlist ? `<button class="car-wishlist ${isFavorite ? 'active' : ''}" type="button" title="${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}" aria-label="${isFavorite ? 'Remove' : 'Add'} ${escapeHtml(vehicle.make + ' ' + vehicle.model)} ${isFavorite ? 'from' : 'to'} favorites"><i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i></button>` : ''}
                    <img src="${imagePrefix}${vehicle.image}" alt="${escapeHtml(vehicle.make + ' ' + vehicle.model)}" loading="lazy" onerror="this.src='${imagePrefix}car.png'">
                </div>
                <div class="car-details">
                    <h3 class="car-title">${escapeHtml(vehicle.make + ' ' + vehicle.model)}</h3>
                    <div class="car-features">
                        <span class="car-feature"><i class="fas fa-cog"></i> ${escapeHtml(vehicle.transmission)}</span>
                        <span class="car-feature"><i class="fas fa-gas-pump"></i> ${escapeHtml(vehicle.fuel)}</span>
                        <span class="car-feature"><i class="fas fa-users"></i> ${vehicle.seats} Seats</span>
                    </div>
                    <div class="car-price-row">
                        <span class="car-price">₱${vehicle.price.toLocaleString()}<span>/day</span></span>
                        <a href="${detailsHref}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </div>`;
    }

    function bindFavoriteButtons(root, toast) {
        (root || document).querySelectorAll('.car-wishlist').forEach(function (button) {
            if (button.dataset.favoriteBound === '1') return;
            button.dataset.favoriteBound = '1';
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const card = button.closest('.car-card');
                if (!card) return;
                const id = Number(card.dataset.vehicleId);
                let favorites = getFavorites();
                const index = favorites.indexOf(id);
                const added = index === -1;
                if (added) favorites.push(id); else favorites.splice(index, 1);
                setFavorites(favorites);
                button.classList.toggle('active', added);
                const icon = button.querySelector('i');
                if (icon) icon.className = added ? 'fas fa-heart' : 'far fa-heart';
                button.title = added ? 'Remove from Favorites' : 'Add to Favorites';
                if (typeof toast === 'function') toast(added ? 'Added to favorites!' : 'Removed from favorites!');
            });
        });
    }

    function renderCards(container, options) {
        if (!container) return;
        const opts = options || {};
        let data = Array.isArray(opts.vehicles) ? opts.vehicles : fleet.slice();
        if (typeof opts.filter === 'function') data = data.filter(opts.filter);
        if (typeof opts.sort === 'function') data.sort(opts.sort);
        if (typeof opts.limit === 'number') data = data.slice(0, opts.limit);
        container.innerHTML = data.map(function (vehicle) { return cardHtml(vehicle, opts); }).join('');
        bindFavoriteButtons(container, opts.toast);
        return data;
    }

    window.TourGoDemoFleet = fleet;
    window.TourGoDemoFleetUI = {
        escapeHtml,
        getFavorites,
        setFavorites,
        cardHtml,
        bindFavoriteButtons,
        renderCards
    };
})(window);
