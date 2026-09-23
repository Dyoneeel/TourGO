async function initializeDatePickers() {
    const bookedDates = await fetchBookedDates();
    
    const config = {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: [
            function(date) {
                const dateStr = date.toISOString().split('T')[0];
                return bookedDates.includes(dateStr);
            }
        ],
        onChange: function(selectedDates, dateStr, instance) {
            calculateTotal();
        }
    };

    // Initialize pickup date picker
    const pickupDatePicker = flatpickr("#pickup_date", {
        ...config,
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates[0]) {
                returnDatePicker.set('minDate', selectedDates[0]);
                if (returnDatePicker.selectedDates[0] && 
                    returnDatePicker.selectedDates[0] <= selectedDates[0]) {
                    returnDatePicker.clear();
                }
            }
            calculateTotal();
        }
    });

    // Initialize return date picker
    const returnDatePicker = flatpickr("#return_date", {
        ...config,
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates[0]) {
                if (pickupDatePicker.selectedDates[0] && 
                    pickupDatePicker.selectedDates[0] >= selectedDates[0]) {
                    pickupDatePicker.clear();
                }
            }
            calculateTotal();
        }
    });

    // Add custom styling for unavailable dates
    document.addEventListener('flatpickr:monthChange', () => {
        styleUnavailableDates(bookedDates);
    });
    document.addEventListener('flatpickr:yearChange', () => {
        styleUnavailableDates(bookedDates);
    });
    document.addEventListener('flatpickr:open', () => {
        setTimeout(() => {
            styleUnavailableDates(bookedDates);
        }, 100);
    });
}
