/**
 * STACKLY OUTDOOR & CAMPING - Authentication & Session Engine
 * Handles user accounts, role-based authorization (Admin / Customer),
 * client-side JavaScript validation (email format, 5+ character password),
 * session persistence, and dynamic navigation state.
 */

const AUTH_STORAGE_KEY = "stackly_auth_user_v1";
const USERS_STORAGE_KEY = "stackly_users_db_v1";

// Default Seed Accounts
const DEFAULT_USERS = [
  {
    id: "usr-admin-01",
    name: "Marcus Thorne",
    email: "admin@stackly.com",
    password: "admin123",
    role: "admin",
    roleLabel: "Store Administrator",
    title: "Chief Expedition Officer & Admin",
    avatar: "assets/images/sections/avatar-1.webp",
    registeredDate: "Jan 14, 2024",
    phone: "+1 (303) 555-0192",
    location: "Boulder HQ, Colorado",
    status: "active"
  },
  {
    id: "usr-cust-01",
    name: "Alex Rivers",
    email: "alex@backcountry.com",
    password: "alex123",
    role: "customer",
    roleLabel: "Customer / Adventurer",
    title: "Summit Explorer (Tier 3)",
    avatar: "assets/images/sections/avatar-2.webp",
    registeredDate: "May 22, 2024",
    phone: "+1 (303) 847-2910",
    location: "Boulder, CO",
    status: "active",
    trailPoints: 1450,
    tier: "Summit Explorer",
    ordersCount: 4,
    totalSpent: 896.95,
    favoriteActivity: "Alpine Backpacking"
  },
  {
    id: "usr-cust-02",
    name: "Sarah Jenkins",
    email: "sarah.trail@summit.com",
    password: "trailpass",
    role: "customer",
    roleLabel: "Customer / Adventurer",
    title: "Backcountry Scout (Tier 2)",
    avatar: "assets/images/sections/avatar-3.webp",
    registeredDate: "Aug 10, 2024",
    phone: "+1 (206) 555-4819",
    location: "Seattle, WA",
    status: "active",
    trailPoints: 820,
    tier: "Backcountry Scout",
    ordersCount: 2,
    totalSpent: 348.00,
    favoriteActivity: "Trail Running & Hiking"
  }
];

class AuthManager {
  constructor() {
    this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    this.initDatabase();
    this.currentUser = this.loadCurrentUser();
    this.initHeaderUI();
  }

  // --- Database Initialization ---
  initDatabase() {
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      }
    } catch (e) {
      console.warn("LocalStorage access limited:", e);
    }
  }

  getUsers() {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users database:", e);
    }
  }

  // --- Session Management ---
  loadCurrentUser() {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to update auth session:", e);
    }
    this.initHeaderUI();
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === "admin";
  }

  isCustomer() {
    return this.currentUser && this.currentUser.role === "customer";
  }

  logout(redirectUrl = "login.html") {
    this.setCurrentUser(null);
    if (window.stacklyCart && typeof window.stacklyCart.showToast === "function") {
      window.stacklyCart.showToast("Signed out successfully. Happy trails!", "info");
    }
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 400);
  }

  // --- Pure JS Validation Rules (Strictly evaluated in JS) ---
  validateEmail(email) {
    const trimmed = (email || "").trim();
    if (!trimmed) {
      return { isValid: false, message: "Please enter your email address." };
    }
    if (!this.emailRegex.test(trimmed)) {
      return { isValid: false, message: "Please enter a valid email address (e.g., name@domain.com)." };
    }
    return { isValid: true, message: "" };
  }

  validatePassword(password) {
    const raw = password || "";
    if (!raw) {
      return { isValid: false, message: "Please enter your password." };
    }
    if (raw.length < 5) {
      return { isValid: false, message: "Password must be at least 5 characters long." };
    }
    return { isValid: true, message: "" };
  }

  validateName(name) {
    const trimmed = (name || "").trim();
    if (!trimmed) {
      return { isValid: false, message: "Please enter your full name." };
    }
    if (trimmed.length < 2) {
      return { isValid: false, message: "Full name must be at least 2 characters." };
    }
    return { isValid: true, message: "" };
  }

  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return { isValid: false, message: "Please confirm your password." };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match. Please re-enter." };
    }
    return { isValid: true, message: "" };
  }

  // --- Login Action with JS Validation & Role Handling ---
  login(email, password, selectedRole = "customer") {
    const errors = {};

    const emailCheck = this.validateEmail(email);
    if (!emailCheck.isValid) {
      errors.email = emailCheck.message;
    }

    const passwordCheck = this.validatePassword(password);
    if (!passwordCheck.isValid) {
      errors.password = passwordCheck.message;
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      // Check password
      if (user.password !== password) {
        errors.password = "Incorrect password. Please try again.";
        return { success: false, errors };
      }

      // Check account status
      if (user.status === "suspended") {
        errors.general = "This account has been temporarily suspended. Please contact Boulder HQ support.";
        return { success: false, errors };
      }

      // Check role compatibility
      if (selectedRole === "admin" && user.role !== "admin") {
        errors.general = `The account "${user.email}" does not have Administrator privileges. Please select "Customer / Adventurer" role, or sign in with admin@stackly.com.`;
        return { success: false, errors };
      }

      // Update role if user explicitly chose customer
      this.setCurrentUser(user);
      const redirectUrl = user.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
      return { success: true, user, redirectUrl };
    } else {
      // If user doesn't exist in pre-seeded list, create a new demo account smoothly!
      // This ensures any valid email + 5-character password works instantly in this interactive demo
      const displayName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const newUser = {
        id: "usr-" + Date.now(),
        name: displayName || "Outdoor Enthusiast",
        email: cleanEmail,
        password: password,
        role: selectedRole === "admin" ? "admin" : "customer",
        roleLabel: selectedRole === "admin" ? "Store Administrator" : "Customer / Adventurer",
        title: selectedRole === "admin" ? "Store Administrator" : "Backcountry Explorer",
        avatar: "assets/images/sections/avatar-1.webp",
        registeredDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        phone: "+1 (555) 012-3456",
        location: "Boulder, CO",
        status: "active",
        trailPoints: 500,
        tier: "Trail Scout",
        ordersCount: 1,
        totalSpent: 149.00
      };

      users.push(newUser);
      this.saveUsers(users);
      this.setCurrentUser(newUser);

      const redirectUrl = newUser.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
      return { success: true, user: newUser, redirectUrl };
    }
  }

  // --- Registration Action with Pure JS Validation ---
  register({ name, email, password, confirmPassword, role = "customer", agreedTerms = false }) {
    const errors = {};

    const nameCheck = this.validateName(name);
    if (!nameCheck.isValid) errors.name = nameCheck.message;

    const emailCheck = this.validateEmail(email);
    if (!emailCheck.isValid) errors.email = emailCheck.message;

    const passwordCheck = this.validatePassword(password);
    if (!passwordCheck.isValid) errors.password = passwordCheck.message;

    const confirmCheck = this.validateConfirmPassword(password, confirmPassword);
    if (!confirmCheck.isValid) errors.confirmPassword = confirmCheck.message;

    if (!agreedTerms) {
      errors.terms = "You must agree to the Stackly Trail Club Terms & Privacy Policy to create an account.";
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      errors.email = "An account with this email address already exists. Please sign in instead.";
      return { success: false, errors };
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role === "admin" ? "admin" : "customer",
      roleLabel: role === "admin" ? "Store Administrator" : "Customer / Adventurer",
      title: role === "admin" ? "Store Administrator" : "Trail Scout (Tier 1)",
      avatar: "assets/images/sections/avatar-2.webp",
      registeredDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      phone: "+1 (555) 234-5678",
      location: "United States",
      status: "active",
      trailPoints: 200, // Welcome bonus points!
      tier: "Trail Scout",
      ordersCount: 0,
      totalSpent: 0.00,
      favoriteActivity: "Hiking & Camping"
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    const redirectUrl = newUser.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
    return { success: true, user: newUser, redirectUrl };
  }

  // --- Dynamic Header State & Dropdown Management ---
  initHeaderUI() {
    const user = this.currentUser;
    const headerNavRight = document.querySelector(".header-nav-right");
    if (!headerNavRight) return;

    // Check if account pill or button already exists
    let userBtn = document.getElementById("headerUserBtn");
    if (!userBtn) {
      userBtn = document.createElement("div");
      userBtn.id = "headerUserBtn";
      userBtn.className = "header-user-wrapper";

      // Insert before search button or at start of header-nav-right
      const searchBtn = headerNavRight.querySelector(".search-trigger-btn");
      if (searchBtn) {
        headerNavRight.insertBefore(userBtn, searchBtn);
      } else {
        headerNavRight.appendChild(userBtn);
      }
    }

    if (user) {
      const firstName = user.name.split(" ")[0];
      const dashboardLink = user.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
      const dashboardLabel = user.role === "admin" ? "Admin Console" : "My Dashboard";
      const roleBadge = user.role === "admin" ? "ADMIN" : "MEMBER";

      // userBtn.innerHTML = `
      //   <div class="user-pill-dropdown-trigger" id="userPillTrigger" tabindex="0" role="button" aria-expanded="false" aria-label="User Account Menu">
      //     <span class="user-avatar-circle">${firstName.charAt(0)}</span>
      //     <span class="user-name-label">${firstName}</span>
      //     <span class="user-badge-mini ${user.role}">${roleBadge}</span>
      //     <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      //   </div>
      //   <div class="user-dropdown-menu" id="userDropdownMenu">
      //     <div class="dropdown-header">
      //       <strong>${user.name}</strong>
      //       <span class="dropdown-email">${user.email}</span>
      //       <span class="dropdown-role-pill">${user.roleLabel}</span>
      //     </div>
      //     <div class="dropdown-divider"></div>
      //     <a href="${dashboardLink}" class="dropdown-item">
      //       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
      //       ${dashboardLabel}
      //     </a>
  
      //     ${user.role === "admin" ? `
      //       <a href="customer-dashboard.html" class="dropdown-item">
      //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      //         Customer View
      //       </a>
    
      //     ` : `
      //       <a href="admin-dashboard.html" class="dropdown-item">
      //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      //         Admin Portal
      //       </a>
    
      //     `}
      //     <a href="shop.html?view=wishlist" class="dropdown-item">
      //       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      //       Saved Gear
      //     </a>
  
      //     <div class="dropdown-divider"></div>
      //     <button type="button" class="dropdown-item logout-btn" id="headerLogoutBtn">
      //       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
      //       Sign Out
      //     </button>
      //   </div>
      // `;

      // Toggle dropdown listeners
      const trigger = document.getElementById("userPillTrigger");
      const menu = document.getElementById("userDropdownMenu");
      const logoutBtn = document.getElementById("headerLogoutBtn");

      if (trigger && menu) {
        trigger.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = menu.classList.contains("active");
          menu.classList.toggle("active", !isOpen);
          trigger.setAttribute("aria-expanded", (!isOpen).toString());
        });

        document.addEventListener("click", (e) => {
          if (!userBtn.contains(e.target)) {
            menu.classList.remove("active");
            trigger.setAttribute("aria-expanded", "false");
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => this.logout());
      }
    } else {
      userBtn.innerHTML = `
        <!-- no duplicate button -->



      `;
    }

    // Also update Mobile Navigation Drawer links if present
    this.updateMobileNavUI(user);
  }

  updateMobileNavUI(user) {
    const navDrawer = document.getElementById("mobileNavDrawer");
    if (!navDrawer) return;

    let authLinksContainer = navDrawer.querySelector(".mobile-nav-auth-section");
    if (!authLinksContainer) {
      authLinksContainer = document.createElement("div");
      authLinksContainer.className = "mobile-nav-auth-section";
      const navLinks = navDrawer.querySelector(".mobile-nav-links");
      if (navLinks) {
        navLinks.parentNode.insertBefore(authLinksContainer, navLinks.nextSibling);
      }
    }

    if (user) {
      const dashboardLink = user.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
      const dashboardLabel = user.role === "admin" ? "Admin Console" : "Customer Dashboard";

      authLinksContainer.innerHTML = `
        <div class="mobile-auth-user-chip">
          <span class="mobile-chip-avatar">${user.name.charAt(0)}</span>
          <div class="mobile-chip-info">
            <strong>${user.name}</strong>
            <small>${user.roleLabel}</small>
          </div>
        </div>
        <div class="mobile-auth-nav-links">
          <a href="${dashboardLink}" class="mobile-auth-link">
            <span>📊 ${dashboardLabel}</span> <span>&rarr;</span></a>
  
          <a href="admin-dashboard.html" class="mobile-auth-link">
            <span>🛡️ Admin Portal</span> <span>&rarr;</span></a>
  
          <a href="customer-dashboard.html" class="mobile-auth-link">
            <span>🌲 Customer Hub</span> <span>&rarr;</span></a>
  
          <button type="button" class="mobile-logout-btn" id="mobileLogoutBtn">
            <span>🚪 Sign Out</span>
          </button>
        </div>
      `;

      const mLogout = document.getElementById("mobileLogoutBtn");
      if (mLogout) {
        mLogout.addEventListener("click", () => this.logout());
      }
    } else {
      authLinksContainer.innerHTML = `
        <div class="mobile-auth-nav-links">
          <a href="login.html" class="mobile-auth-link highlight">
            <span>🔑 Sign In</span> <span>&rarr;</span></a>
  
          <a href="register.html" class="mobile-auth-link">
            <span>✨ Create Account</span> <span>&rarr;</span></a>
  
          <a href="customer-dashboard.html" class="mobile-auth-link">
            <span>🌲 Customer Dashboard (Demo)</span> <span>&rarr;</span></a>
  
          <a href="admin-dashboard.html" class="mobile-auth-link">
            <span>🛡️ Admin Dashboard (Demo)</span> <span>&rarr;</span></a>
  
        </div>
      `;
    }
  }

  // --- Auth Route Guard ---
  requireAuth(requiredRole = null) {
    if (!this.currentUser) {
      // Not logged in -> redirect to login with return parameter
      const returnUrl = encodeURIComponent(window.location.pathname.split("/").pop());
      window.location.href = `login.html?redirect=${returnUrl}`;
      return false;
    }

    if (requiredRole && this.currentUser.role !== requiredRole) {
      // In this demo, allow easy switching or notify
      console.warn(`User role "${this.currentUser.role}" does not match required role "${requiredRole}". Allowing demo access.`);
      return true;
    }

    return true;
  }
}

// Global Singleton Initialization
window.stacklyAuth = new AuthManager();
