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

        // Hardcoded Credentials (Demo)
        const validId = "admin";
        const validPass = "12345";

        if (workerId === validId && password === validPass) {
            // Success
            enterDashboard();
        } else {
            // Error
            alert("Xato ID yoki Parol! \n(Demo uchun: ID=admin, Parol=12345)");
            workerIdInput.value = "";
            document.getElementById('password').value = "";
            workerIdInput.focus();
        }
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
