document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginForm = document.getElementById('login-form');
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const mainContainer = document.getElementById('main-container');
    const logoutBtn = document.getElementById('logout-btn');
    const workerIdInput = document.getElementById('worker-id');

    // Login Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const workerId = workerIdInput.value.trim();
        const password = document.getElementById('password').value.trim();

        // API Login Request
        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: workerId, password: password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    enterDashboard();
                } else {
                    alert(data.message || "Xato ID yoki Parol!");
                    workerIdInput.value = "";
                    document.getElementById('password').value = "";
                    workerIdInput.focus();
                }
            })
            .catch(err => {
                alert("Server bilan bog'lanishda xato!");
                console.error(err);
            });
    });

    // Logout Handler
    logoutBtn.addEventListener('click', () => {
        exitDashboard();
    });

    // Validations / Visual feedback can be added here

    // Functions
    function enterDashboard() {
        // Fade out login
        loginView.style.opacity = '0';

        setTimeout(() => {
            loginView.classList.add('hidden');

            // Expand container for dashboard
            mainContainer.classList.add('dashboard-mode');

            // Show dashboard
            dashboardView.classList.remove('hidden');
            dashboardView.style.opacity = '0';

            // Trigger reflow
            void dashboardView.offsetWidth;

            dashboardView.style.opacity = '1';
        }, 300);
    }

    function exitDashboard() {
        dashboardView.style.opacity = '0';

        setTimeout(() => {
            dashboardView.classList.add('hidden');
            mainContainer.classList.remove('dashboard-mode');

            loginView.classList.remove('hidden');
            // Trigger reflow
            void loginView.offsetWidth;

            loginView.style.opacity = '1';

            // Reset form
            loginForm.reset();
        }, 300);
    }
});
