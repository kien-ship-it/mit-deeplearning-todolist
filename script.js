document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('startDate');
    const checkboxes = document.querySelectorAll('#todoList input[type="checkbox"]');
    const deadlineSpans = document.querySelectorAll('.deadline'); // Get all deadline spans

    const STORAGE_KEY_STATE = 'mitDeepLearningTodoState';
    const STORAGE_KEY_DATE = 'mitDeepLearningStartDate';

    // --- Date Calculation ---
    function calculateDeadline(startDate, weekOffset) {
        if (!startDate || isNaN(startDate.getTime())) {
            return "Set Start Date";
        }
        const targetDate = new Date(startDate);
        targetDate.setDate(targetDate.getDate() + (weekOffset * 7) - 1); // Target end of the week (Sunday)

        // Format date (e.g., "Sun, Mar 9, 2025")
        return targetDate.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function updateAllDeadlines() {
        const startDateValue = startDateInput.value;
        const startDate = startDateValue ? new Date(startDateValue + 'T00:00:00') : null; // Ensure consistent parsing

        deadlineSpans.forEach(span => {
            const weekOffset = parseInt(span.getAttribute('data-week-offset'), 10);
            if (!isNaN(weekOffset)) {
                 span.textContent = calculateDeadline(startDate, weekOffset);
            }
        });
    }

    // --- State Management ---
    function saveState() {
        const currentState = {};
        checkboxes.forEach(checkbox => {
            currentState[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(currentState));
        localStorage.setItem(STORAGE_KEY_DATE, startDateInput.value);
        // console.log("State Saved");
    }

    function loadState() {
        // Load Start Date
        const savedDate = localStorage.getItem(STORAGE_KEY_DATE);
        if (savedDate) {
            startDateInput.value = savedDate;
        }

        // Load Checkbox States
        const savedState = localStorage.getItem(STORAGE_KEY_STATE);
        if (savedState) {
            const state = JSON.parse(savedState);
            checkboxes.forEach(checkbox => {
                if (state[checkbox.id] !== undefined) {
                    checkbox.checked = state[checkbox.id];
                }
            });
            // console.log("State Loaded");
        }

        // Update deadlines based on loaded/default date
        updateAllDeadlines();
    }

    // --- Event Listeners ---
    startDateInput.addEventListener('change', () => {
        updateAllDeadlines();
        saveState(); // Save date change immediately
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveState);
    });

    // --- Initial Load ---
    loadState();
});