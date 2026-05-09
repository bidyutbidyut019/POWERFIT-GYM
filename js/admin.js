// ====================================
// POWERFIT GYM ADMIN JAVASCRIPT
// ====================================

document.addEventListener("DOMContentLoaded", () => {

    // ====================================
    // INITIALIZE ADMIN
    // ====================================

    initializeAdmin();

});

// ====================================
// INITIALIZE ADMIN
// ====================================

function initializeAdmin() {

    // ====================================
    // CHECK ADMIN ACCESS
    // ====================================

    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");

    if (!token || !userDataString) {
        window.location.href = "login.html";
        return;
    }

    const userData = JSON.parse(userDataString);

    if (userData.role !== 'admin') {
        window.location.href = "dashboard.html";
        return;
    }

    // ====================================
    // SETUP ADMIN FUNCTIONS
    // ====================================

    setupAdminHeader(userData);

    setupTableFunctionality();

    setupResponsiveSidebar();

    // ====================================
    // LOAD DATA
    // ====================================

    loadAdminStats();

    loadUsers();

}

// ====================================
// SETUP ADMIN HEADER
// ====================================

function setupAdminHeader(userData) {

    const adminAvatar = document.querySelector(".admin-avatar");
    const adminUsername = document.querySelector(".admin-user-info .username");

    if (adminAvatar && userData.firstName) {
        adminAvatar.textContent = userData.firstName.charAt(0).toUpperCase();
    }

    if (adminUsername && userData.firstName) {
        adminUsername.textContent = userData.firstName;
    }

    // ====================================
    // LOGOUT BUTTON
    // ====================================

    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            adminLogout();
        });
    }

}

// ====================================
// SETUP TABLE FUNCTIONALITY
// ====================================

function setupTableFunctionality() {

    // Add event listeners to action buttons
    const editBtns = document.querySelectorAll(".edit-btn");
    const deleteBtns = document.querySelectorAll(".delete-btn");

    editBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const row = btn.closest("tr");
            const itemId = row.getAttribute("data-id");
            editItem(itemId);
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this item?")) {
                const row = btn.closest("tr");
                row.style.animation = "fadeOut 0.3s ease";
                setTimeout(() => row.remove(), 300);
            }
        });
    });

    // Add button
    const addBtn = document.querySelector(".add-btn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            addNewItem();
        });
    }

}

// ====================================
// EDIT ITEM
// ====================================

function editItem(itemId) {

    console.log("Editing item:", itemId);
    alert("Edit functionality - Item ID: " + itemId);

}

// ====================================
// ADD NEW ITEM
// ====================================

function addNewItem() {

    console.log("Adding new item");
    alert("Add new item functionality");

}

// ====================================
// SETUP RESPONSIVE SIDEBAR
// ====================================

function setupResponsiveSidebar() {

    const adminSidebar = document.querySelector(".admin-sidebar");

    if (!adminSidebar) return;

    // Mobile menu toggle (if exists)
    const menuToggle = document.querySelector(".menu-toggle");

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            adminSidebar.classList.toggle("active");
        });
    }

    // Close sidebar on link click
    const sidebarLinks = document.querySelectorAll(".admin-menu a");

    sidebarLinks.forEach(link => {
        link.addEventListener("click", () => {
            adminSidebar.classList.remove("active");
        });
    });

}

// ====================================
// ADMIN LOGOUT
// ====================================

function adminLogout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("currentUser");

        window.location.href = "login.html";

    }

}

// ====================================
// ADD ANIMATIONS
// ====================================

const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

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
