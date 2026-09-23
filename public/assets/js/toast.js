function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const newC = document.createElement('div');
        newC.className = 'toast-container';
        document.body.appendChild(newC);
        return newC;
    })();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 500);
    }, 3000);
}
