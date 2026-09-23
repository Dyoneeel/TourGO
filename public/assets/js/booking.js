document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.actual-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const pickupDate = document.getElementById('pickup_date').value;
            const returnDate = document.getElementById('return_date').value;
            const vehicleId = document.querySelector('input[name="vehicle_id"]').value;

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking availability...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('vehicle_id', vehicleId);
                formData.append('pickup_date', pickupDate);
                formData.append('return_date', returnDate);

                const response = await fetch('../ajax/check_availability.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    showToast('Error checking availability. Please try again.', 'error');
                } else if (!data.available) {
                    showToast(data.message || 'Vehicle is not available for selected dates', 'error');
                } else {
                    // If available, submit the form
                    this.submit();
                }
            } catch (error) {
                showToast('Error checking availability. Please try again.', 'error');
                console.error('Error:', error);
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
