// ====================================
// POWERFIT GYM DASHBOARD JAVASCRIPT
// ====================================

document.addEventListener("DOMContentLoaded", () => {

    // ====================================
    // LOAD SIDEBAR
    // ====================================

    loadSidebar();

    // ====================================
    // INITIALIZE DASHBOARD
    // ====================================

    initializeDashboard();

});

// ====================================
// LOAD SIDEBAR COMPONENT
// ====================================

function loadSidebar() {

    const sidebarContainer = document.getElementById("sidebar");

    if (!sidebarContainer) return;

    fetch("../components/sidebar.html")
        .then(response => response.text())
        .then(html => {
            sidebarContainer.innerHTML = html;
            setupSidebarToggle();
        })
        .catch(error => console.error("Error loading sidebar:", error));

}

// ====================================
// SETUP SIDEBAR TOGGLE
// ====================================

function setupSidebarToggle() {

    const sidebar = document.querySelector(".dashboard-sidebar");

    if (!sidebar) return;

    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    // Close sidebar on link click
    const sidebarLinks = document.querySelectorAll(".sidebar-menu a");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("active");
        });
    });

}

// ====================================
// INITIALIZE DASHBOARD
// ====================================

function initializeDashboard() {

    // ====================================
    // CHECK USER LOGIN
    // ====================================

    const token = localStorage.getItem("token");

    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        window.location.href = "login.html";
        return;
    }

    // ====================================
    // LOAD USER DATA
    // ====================================

    const user = JSON.parse(userData);

    updateUserDisplay(user);

    // ====================================
    // LOAD USER MEMBERSHIP
    // ====================================

    loadUserMembership(user);

    // ====================================
    // LOAD USER BOOKINGS
    // ====================================

    loadUserBookings();

    // ====================================
    // SETUP LOGOUT
    // ====================================

    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logout();
        });
    }

    // ====================================
    // LOAD STATS
    // ====================================

    loadDashboardStats();

}

// ====================================
// UPDATE USER DISPLAY
// ====================================

function updateUserDisplay(userData) {

    const userAvatar = document.querySelector(".user-avatar");

    const username = document.querySelector(".username");

    const role = document.querySelector(".role");

    // UPDATE AVATAR

    if (userAvatar && userData.firstName) {

        userAvatar.textContent =
            userData.firstName.charAt(0).toUpperCase();

    }

    // UPDATE USERNAME

    if (username && userData.firstName) {

        username.textContent =
            userData.firstName;

    }

    // UPDATE ROLE/MEMBERSHIP

    if (role) {

        role.textContent =
            `${userData.membership || 'Basic'} Member`;

    }

    // UPDATE MEMBERSHIP CARD VALUE

    const membershipCardValue =
        document.querySelector(
            '.membership-card-link .stat-value'
        );

    if (membershipCardValue) {

        membershipCardValue.textContent =
            userData.membership || 'Basic';

    }

}

// ====================================
// LOAD USER BOOKINGS
// ====================================

function loadUserBookings() {

    try {

        // Try to load from server first
        apiGetBookings()
            .then(data => {

                if (data.success && data.data) {

                    console.log('User Bookings:', data.data);
                    // Update dashboard with bookings
                    displayBookings(data.data);

                }

            })
            .catch(error => {

                console.log('Error loading bookings from server:', error);
                // Load from local storage as fallback
                const localBookings = JSON.parse(
                    localStorage.getItem("gymBookings")
                ) || [];

                displayBookings(localBookings);

            });

    } catch (error) {

        console.error('Error in loadUserBookings:', error);

    }

}

// ====================================
// DISPLAY BOOKINGS
// ====================================

function displayBookings(bookings) {

    console.log('Displaying bookings:', bookings);
    // Add functionality to display bookings on dashboard

}

// ====================================
// LOAD USER MEMBERSHIP
// ====================================

async function loadUserMembership(user) {

    try {

        const response =
            await fetch(

                `http://localhost:5000/api/memberships/user/${user.id}`,

                {

                    headers: {

                        'Authorization':
                            `Bearer ${localStorage.getItem('token')}`

                    }

                }

            );

        const data =
            await response.json();

        if (data.success && data.data) {

            const membership = data.data;

            // Update user object
            user.membership = membership.plan;

            // Update localStorage
            localStorage.setItem(
                'user',
                JSON.stringify(user)
            );

            // Update display
            const role =
                document.querySelector('.role');

            if (role) {

                role.textContent =
                    `${membership.plan || 'Basic'} Member`;

            }

            // Update membership card
            const membershipCardValue =
                document.querySelector(
                    '.membership-card-link .stat-value'
                );

            if (membershipCardValue) {

                membershipCardValue.textContent =
                    membership.plan || 'Basic';

            }

        }

    }

    catch (error) {

        console.log(
            'Error loading membership:',
            error
        );

    }

}

// ====================================
// LOAD DASHBOARD STATS
// ====================================

function loadDashboardStats() {

    // Simulate loading stats
    const statCards = document.querySelectorAll(".stat-card");

    statCards.forEach((card, index) => {
        // Add animation delay
        card.style.animation = `slideUp 0.5s ease ${index * 0.1}s both`;
    });

}

// ====================================
// LOGOUT
// ====================================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "login.html";

    }

}

// ====================================
// PERFORM LOGOUT (FOR SIDEBAR)
// ====================================

function performLogout(event) {

    event.preventDefault();

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "login.html";

    }

}

// ====================================
// ADD ANIMATION
// ====================================

const style = document.createElement("style");
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
