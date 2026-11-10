/**
 * STACKLY OUTDOOR & CAMPING - Master Dashboard Interactive Controller
 * Powers both Admin Dashboard and Customer Dashboard with real-world functionality,
 * dynamic DOM rendering, localStorage persistence, modal controllers, and pure JS validation.
 */

// Helper to show rich toast notifications
function showDashToast(message, type = "success") {
  let container = document.getElementById("stacklyToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "stacklyToastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconSvg = "";
  if (type === "success") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === "error") {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-msg">${message}</div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.classList.add("toast-hiding");
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("toast-hiding");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

/* ==========================================================================
   1. ADMIN DASHBOARD CONTROLLER
   ========================================================================== */
class AdminDashboard {
  constructor() {
    this.dataManager = window.stacklyData;
    this.authManager = window.stacklyAuth;
    this.currentUser = this.authManager ? this.authManager.currentUser : null;
    this.activeTab = "overview";
    this.init();
  }

  init() {
    this.setupSidebarToggle();
    this.setupTabNavigation();
    this.renderHeaderUserInfo();
    this.renderOverviewTab();
    this.renderProductsTab();
    this.renderOrdersTab();
    this.renderCustomersTab();
    this.renderAnalyticsTab();
    this.renderSettingsTab();
    this.setupGlobalSearch();
    this.setupModals();
  }

  setupSidebarToggle() {
    const toggleBtn = document.getElementById("dashMobileToggle");
    const sidebar = document.getElementById("dashSidebar");
    const closeBtn = document.getElementById("dashSidebarClose");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
      });
    }

    // Close sidebar on link click on mobile
    if (sidebar) {
      sidebar.querySelectorAll(".dash-nav-link").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 1023) {
            sidebar.classList.remove("open");
          }
        });
      });
    }
  }

  setupTabNavigation() {
    const navLinks = document.querySelectorAll(".dash-nav-link[data-tab]");
    const tabPanes = document.querySelectorAll(".dash-tab-pane");
    const pageTitle = document.getElementById("dashPageTitle");
    const breadcrumbSub = document.getElementById("dashBreadcrumbSub");

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-tab");
        if (!targetTab) return;

        this.activeTab = targetTab;

        // Update nav links
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        // Update panes
        tabPanes.forEach(pane => {
          if (pane.id === `tab-${targetTab}`) {
            pane.classList.add("active");
          } else {
            pane.classList.remove("active");
          }
        });

        // Update titles
        const tabTitle = link.getAttribute("data-title") || "Admin Console";
        if (pageTitle) pageTitle.textContent = tabTitle;
        if (breadcrumbSub) breadcrumbSub.textContent = `ADMIN PORTAL / ${targetTab.toUpperCase()}`;

        // Re-render target tab to refresh latest changes
        if (targetTab === "overview") this.renderOverviewTab();
        if (targetTab === "products") this.renderProductsTab();
        if (targetTab === "orders") this.renderOrdersTab();
        if (targetTab === "customers") this.renderCustomersTab();
        if (targetTab === "analytics") this.renderAnalyticsTab();
        if (targetTab === "settings") this.renderSettingsTab();
      });
    });
  }

  renderHeaderUserInfo() {
    const user = this.currentUser || (window.stacklyAuth ? window.stacklyAuth.currentUser : null) || { 
      name: "Marcus Thorne", 
      email: "admin@stackly.com", 
      roleLabel: "Store Administrator" 
    };
    const nameEl = document.getElementById("adminUserName");
    const emailEl = document.getElementById("adminUserEmail");
    const roleEl = document.getElementById("adminUserRole");
    const avatarEl = document.getElementById("adminUserAvatar");

    if (nameEl) nameEl.textContent = user.name || user.email;
    if (emailEl) {
      emailEl.textContent = user.email || "admin@stackly.com";
      emailEl.title = user.email || "admin@stackly.com";
    }
    if (roleEl) roleEl.textContent = user.roleLabel || (user.role === "admin" ? "Store Administrator" : "User");
    if (avatarEl) {
      const initial = (user.email || user.name || "A").charAt(0).toUpperCase();
      avatarEl.textContent = initial;
    }

    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (this.authManager) this.authManager.logout("login.html");
      });
    }
  }

  // --- TAB 1: OVERVIEW & OPERATIONS ---
  renderOverviewTab() {
    const orders = this.dataManager.getOrders();
    const products = this.dataManager.getProducts();
    const customers = this.authManager ? this.authManager.getUsers().filter(u => u.role === "customer") : [];

    // KPI calculations
    const totalRev = orders.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.total : 0), 0);
    const activeOrders = orders.filter(o => o.fulfillmentStatus === "Pending" || o.fulfillmentStatus === "Processing" || o.fulfillmentStatus === "Shipped").length;
    const lowStockCount = products.filter(p => (p.stockCount || 0) <= 5).length;
    const totalCustomersCount = Math.max(customers.length, 1842);

    // Update KPI elements
    const kpiRev = document.getElementById("kpiTotalRevenue");
    const kpiOrders = document.getElementById("kpiActiveOrders");
    const kpiStock = document.getElementById("kpiLowStock");
    const kpiCust = document.getElementById("kpiTotalCustomers");

    if (kpiRev) kpiRev.textContent = `$${totalRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (kpiOrders) kpiOrders.textContent = activeOrders;
    if (kpiStock) kpiStock.textContent = lowStockCount;
    if (kpiCust) kpiCust.textContent = totalCustomersCount.toLocaleString();

    // Render Sub-section 2: Recent Orders Table
    const recentOrdersContainer = document.getElementById("overviewRecentOrdersList");
    if (recentOrdersContainer) {
      const topOrders = orders.slice(0, 5);
      recentOrdersContainer.innerHTML = topOrders.map(o => `
        <tr>
          <td><strong>#${o.id}</strong></td>
          <td>${o.customer.name}</td>
          <td>${o.items.length} gear item(s)</td>
          <td><strong>$${o.total.toFixed(2)}</strong></td>
          <td><span class="status-pill ${o.fulfillmentStatus.toLowerCase()}">${o.fulfillmentStatus}</span></td>
          <td>
            <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.adminDash.openOrderModal('${o.id}')">
              Details
            </button>
          </td>
        </tr>
      `).join("");
    }

    // Render Top Velocity Gear
    const topGearContainer = document.getElementById("overviewTopGearList");
    if (topGearContainer) {
      const topProds = products.slice(0, 4);
      topGearContainer.innerHTML = topProds.map(p => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid var(--color-border);" />
            <div>
              <strong style="font-size: 0.84rem; display: block; color: var(--color-text-dark);">${p.name}</strong>
              <small style="color: var(--color-text-muted); font-size: 0.72rem;">${p.categoryLabel} &bull; $${p.price.toFixed(2)}</small>
            </div>
          </div>
          <span class="stock-tag ${p.stockCount <= 5 ? 'low-stock' : 'in-stock'}">${p.stockCount} in stock</span>
        </div>
      `).join("");
    }

    // Render Sub-section 3: Critical Low Stock Items with 1-click restock
    const restockList = document.getElementById("overviewRestockAlertsList");
    if (restockList) {
      const lowStockItems = products.filter(p => (p.stockCount || 0) <= 6).slice(0, 3);
      if (lowStockItems.length === 0) {
        restockList.innerHTML = `<p style="font-size:0.84rem; color:var(--color-text-muted);">All gear categories are well stocked above threshold.</p>`;
      } else {
        restockList.innerHTML = lowStockItems.map(p => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--color-border);">
            <div>
              <strong style="font-size: 0.84rem; color: #991b1b;"><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:#ef4444; margin-right:4px;">warning</span> ${p.name}</strong>
              <div style="font-size: 0.72rem; color: var(--color-text-muted);">Current inventory: ${p.stockCount} units remaining</div>
            </div>
            <button class="dash-btn dash-btn-primary dash-btn-sm" onclick="window.adminDash.quickRestock('${p.id}', 10)">
              + Restock 10
            </button>
          </div>
        `).join("");
      }
    }
  }

  // --- TAB 2: PRODUCTS & INVENTORY ---
  renderProductsTab(filteredProducts = null) {
    const catFilter = document.getElementById("prodCategoryFilter");
    if (catFilter && !catFilter.dataset.bound) {
      catFilter.dataset.bound = "true";
      catFilter.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "all") {
          this.renderProductsTab();
        } else {
          const filtered = this.dataManager.getProducts().filter(p => p.category === val);
          this.renderProductsTab(filtered);
        }
      });
    }

    const products = filteredProducts || this.dataManager.getProducts();
    const tbody = document.getElementById("adminProductsTableBody");
    const countBadge = document.getElementById("adminProdCountBadge");

    if (countBadge) countBadge.textContent = products.length;

    if (tbody) {
      if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--color-text-muted);">No products match your filter.</td></tr>`;
        return;
      }

      tbody.innerHTML = products.map(p => {
        let stockTagClass = "in-stock";
        let stockLabel = `${p.stockCount} In Stock`;
        if (p.stockCount === 0) {
          stockTagClass = "out-of-stock";
          stockLabel = "Out of Stock";
        } else if (p.stockCount <= 5) {
          stockTagClass = "low-stock";
          stockLabel = `${p.stockCount} Low Stock`;
        }

        return `
          <tr data-id="${p.id}">
            <td>
              <div class="table-gear-cell">
                <img src="${p.image}" alt="${p.name}" class="table-gear-thumb" />
                <div class="table-gear-info">
                  <strong>${p.name}</strong>
                  <small>SKU: ${p.id.toUpperCase()}</small>
                </div>
              </div>
            </td>
            <td><span class="card-label-badge">${p.categoryLabel || p.category}</span></td>
            <td><strong>$${p.price.toFixed(2)}</strong></td>
            <td>
              <div class="stock-stepper">
                <button type="button" class="stock-step-btn" onclick="window.adminDash.adjustStock('${p.id}', -1)" title="Decrease stock">-</button>
                <span class="stock-step-val">${p.stockCount || 0}</span>
                <button type="button" class="stock-step-btn" onclick="window.adminDash.adjustStock('${p.id}', 1)" title="Increase stock">+</button>
              </div>
            </td>
            <td><span class="stock-tag ${stockTagClass}">${stockLabel}</span></td>
            <td>
              <span style="font-size:0.75rem; color:var(--color-gold-hover);"><span class="material-symbols-outlined" style="font-size:0.95rem; vertical-align:middle; color:var(--color-gold); margin-right:2px;">star</span> ${p.rating || 5.0} (${p.reviewCount || 1})</span>
            </td>
            <td>
              <div class="table-action-btns">
                <button type="button" class="action-icon-btn" onclick="window.location.href='./404.html'" title="Edit Gear">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button type="button" class="action-icon-btn delete" onclick="window.location.href='./404.html'" title="Remove Product">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    // Sub-section 3: Catalog Valuation Stats
    const totalValuation = products.reduce((acc, p) => acc + (p.price * (p.stockCount || 0)), 0);
    const totalUnits = products.reduce((acc, p) => acc + (p.stockCount || 0), 0);
    const valEl = document.getElementById("adminCatalogValuation");
    const unitsEl = document.getElementById("adminCatalogTotalUnits");

    if (valEl) valEl.textContent = `$${totalValuation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (unitsEl) unitsEl.textContent = `${totalUnits.toLocaleString()} units`;
  }

  adjustStock(productId, delta) {
    const updated = this.dataManager.adjustStock(productId, delta);
    if (updated) {
      showDashToast(`Stock for "${updated.name}" updated to ${updated.stockCount} units.`, "info");
      this.renderProductsTab();
      this.renderOverviewTab();
    }
  }

  quickRestock(productId, amount) {
    const updated = this.dataManager.adjustStock(productId, amount);
    if (updated) {
      showDashToast(`Restocked +${amount} units for "${updated.name}"!`, "success");
      this.renderOverviewTab();
      this.renderProductsTab();
    }
  }

  deleteProduct(productId) {
    const prod = this.dataManager.getProductById(productId);
    if (!prod) return;

    if (confirm(`Are you sure you want to delete "${prod.name}" from catalog?`)) {
      this.dataManager.deleteProduct(productId);
      showDashToast(`"${prod.name}" deleted from store catalog.`, "info");
      this.renderProductsTab();
      this.renderOverviewTab();
    }
  }

  // --- TAB 3: ORDERS MANAGEMENT ---
  renderOrdersTab(filteredOrders = null) {
    const orders = filteredOrders || this.dataManager.getOrders();
    const tbody = document.getElementById("adminOrdersTableBody");
    const ordersBadge = document.getElementById("adminOrdersCountBadge");

    if (ordersBadge) ordersBadge.textContent = orders.length;

    if (tbody) {
      if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--color-text-muted);">No orders found.</td></tr>`;
        return;
      }

      tbody.innerHTML = orders.map(o => `
        <tr data-order-id="${o.id}">
          <td>
            <strong>#${o.id}</strong>
            <div style="font-size:0.7rem; color:var(--color-text-muted);">${o.date}</div>
          </td>
          <td>
            <div style="font-weight:600; color:var(--color-text-dark);">${o.customer.name}</div>
            <small style="color:var(--color-text-muted); font-size:0.72rem;">${o.customer.email}</small>
          </td>
          <td>
            <span>${o.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</span>
          </td>
          <td><strong>$${o.total.toFixed(2)}</strong></td>
          <td><span class="status-pill delivered">${o.paymentStatus}</span></td>
          <td>
            <select class="dash-status-select" onchange="window.adminDash.handleStatusChange('${o.id}', this.value)" style="padding: 4px 8px; border-radius: 4px; font-size: 0.78rem; border: 1px solid var(--color-border); font-weight: 600;">
              <option value="Pending" ${o.fulfillmentStatus === "Pending" ? "selected" : ""}>Pending</option>
              <option value="Processing" ${o.fulfillmentStatus === "Processing" ? "selected" : ""}>Processing</option>
              <option value="Shipped" ${o.fulfillmentStatus === "Shipped" ? "selected" : ""}>Shipped</option>
              <option value="Delivered" ${o.fulfillmentStatus === "Delivered" ? "selected" : ""}>Delivered</option>
              <option value="Cancelled" ${o.fulfillmentStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.location.href='./404.html'">
              View Slip
            </button>
          </td>
        </tr>
      `).join("");
    }
  }

  handleStatusChange(orderId, newStatus) {
    const res = this.dataManager.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showDashToast(`Order #${orderId} marked as ${newStatus}!`, "success");
      this.renderOrdersTab();
      this.renderOverviewTab();
    }
  }

  openOrderModal(orderId) {
    const order = this.dataManager.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("adminOrderModal");
    const content = document.getElementById("adminOrderModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:16px; border-bottom:1px solid var(--color-border);">
        <div>
          <span class="welcome-eyebrow">ORDER SLIP</span>
          <h2 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--color-text-dark);">Order #${order.id}</h2>
          <p style="font-size:0.8rem; color:var(--color-text-muted);">Placed on ${order.date} &bull; Payment: ${order.paymentStatus}</p>
        </div>
        <span class="status-pill ${order.fulfillmentStatus.toLowerCase()}">${order.fulfillmentStatus}</span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; padding:14px; background:var(--color-bg-cream); border-radius:8px;">
        <div>
          <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--color-gold-hover);">Customer Info</strong>
          <p style="font-size:0.84rem; margin-top:4px;"><strong>${order.customer.name}</strong><br/>${order.customer.email}<br/>${order.customer.phone || "+1 (555) 019-2831"}</p>
        </div>
        <div>
          <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--color-gold-hover);">Shipping Destination</strong>
          <p style="font-size:0.84rem; margin-top:4px;">${order.customer.shippingAddress || "1420 Pine Needle Way, Boulder, CO 80301"}</p>
        </div>
      </div>

      <div style="margin-top:18px;">
        <h4 style="font-family:var(--font-serif); font-size:1rem; margin-bottom:10px;">Gear Line Items</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${order.items.map(i => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px dashed var(--color-border); font-size:0.84rem;">
              <div style="display:flex; align-items:center; gap:10px;">
                <img src="${i.image}" alt="${i.name}" style="width:36px; height:36px; border-radius:4px; object-fit:cover; border:1px solid var(--color-border);" />
                <span>${i.name} &times; <strong>${i.quantity}</strong></span>
              </div>
              <strong>$${(i.price * i.quantity).toFixed(2)}</strong>
            </div>
          `).join("")}
        </div>
      </div>

      <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--color-border); font-size:0.84rem; display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span><span>$${order.subtotal.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Shipping:</span><span>${order.shippingFee === 0 ? "FREE" : "$" + order.shippingFee.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between;"><span>Sales Tax:</span><span>$${order.tax.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:800; color:var(--color-primary-green); margin-top:6px; padding-top:6px; border-top:1px solid var(--color-border);">
          <span>Total:</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="margin-top:20px; padding:16px; background:#f0f7f3; border-radius:8px; border:1px solid #bbf7d0;">
        <strong style="font-size:0.84rem; color:var(--color-primary-green);">Dispatch Courier & Tracking</strong>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
          <div>
            <label style="font-size:0.75rem; color:var(--color-text-muted); display:block; margin-bottom:4px;">Carrier Service</label>
            <input type="text" id="modalCarrierInput" value="${order.courier || 'FedEx Trail Express'}" class="auth-input" style="padding:8px 10px; font-size:0.84rem;" />
          </div>
          <div>
            <label style="font-size:0.75rem; color:var(--color-text-muted); display:block; margin-bottom:4px;">Tracking Number</label>
            <input type="text" id="modalTrackingInput" value="${order.trackingNumber || 'FDX-' + Math.floor(10000000 + Math.random()*90000000) + 'US'}" class="auth-input" style="padding:8px 10px; font-size:0.84rem;" />
          </div>
        </div>
        <button class="dash-btn dash-btn-primary" onclick="window.adminDash.saveTrackingInfo('${order.id}')" style="margin-top:12px; width:100%; justify-content:center;">
          Update Tracking & Mark Shipped
        </button>
      </div>
    `;

    modal.classList.add("active");
  }

  saveTrackingInfo(orderId) {
    const trackingInput = document.getElementById("modalTrackingInput");
    const trackingNum = trackingInput ? trackingInput.value.trim() : "FDX-12345";
    this.dataManager.updateOrderStatus(orderId, "Shipped", trackingNum);
    showDashToast(`Tracking dispatched for order #${orderId}! Courier notified.`, "success");
    document.getElementById("adminOrderModal").classList.remove("active");
    this.renderOrdersTab();
    this.renderOverviewTab();
  }

  // --- TAB 4: CUSTOMERS DIRECTORY ---
  renderCustomersTab() {
    const users = this.authManager ? this.authManager.getUsers() : [];
    const tbody = document.getElementById("adminCustomersTableBody");

    if (tbody) {
      tbody.innerHTML = users.map(u => `
        <tr data-user-id="${u.id}">
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="user-avatar-circle" style="width:34px; height:34px;">${u.name.charAt(0)}</div>
              <div>
                <strong>${u.name}</strong>
                <small style="display:block; font-size:0.72rem; color:var(--color-text-muted);">${u.location || 'Boulder, CO'}</small>
              </div>
            </div>
          </td>
          <td>${u.email}</td>
          <td><span class="user-badge-mini ${u.role}">${u.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}</span></td>
          <td>${u.registeredDate || 'May 2024'}</td>
          <td><strong>${u.ordersCount || 1}</strong> orders</td>
          <td><strong>$${(u.totalSpent || 240).toFixed(2)}</strong></td>
          <td>
            <span class="status-pill ${u.status === 'suspended' ? 'cancelled' : 'delivered'}">
              ${u.status === 'suspended' ? 'Suspended' : 'Active'}
            </span>
          </td>
        </tr>
      `).join("");
    }
  }

  // --- TAB 5: ANALYTICS ---
  renderAnalyticsTab() {
    // Interactive Sales Bar Chart
    const bars = document.querySelectorAll(".chart-bar-pillar");
    bars.forEach(bar => {
      bar.addEventListener("mouseenter", () => {
        bar.style.transform = "scaleY(1.05)";
      });
      bar.addEventListener("mouseleave", () => {
        bar.style.transform = "scaleY(1)";
      });
    });
  }

  // --- TAB 6: SETTINGS ---
  renderSettingsTab() {
    const settings = this.dataManager.getSettings();
    const storeNameInput = document.getElementById("setStoreName");
    const supportEmailInput = document.getElementById("setSupportEmail");
    const phoneInput = document.getElementById("setPhone");
    const freeShipInput = document.getElementById("setFreeShipping");
    const taxRateInput = document.getElementById("setTaxRate");

    // if (storeNameInput) storeNameInput.value = settings.storeName;
    // if (supportEmailInput) supportEmailInput.value = settings.supportEmail;
    // if (phoneInput) phoneInput.value = settings.phone;
    // if (freeShipInput) freeShipInput.value = settings.freeShippingThreshold;
    // if (taxRateInput) taxRateInput.value = settings.taxRatePercent;

    const saveBtn = document.getElementById("saveSettingsBtn");
    if (saveBtn) {
      saveBtn.onclick = (e) => {
        e.preventDefault();
        const updated = {
          ...settings,
          storeName: storeNameInput.value.trim(),
          supportEmail: supportEmailInput.value.trim(),
          phone: phoneInput.value.trim(),
          freeShippingThreshold: parseFloat(freeShipInput.value) || 75.00,
          taxRatePercent: parseFloat(taxRateInput.value) || 8.25
        };
        this.dataManager.saveSettings(updated);
        window.location.href='./404.html'
      };
    }

    const resetDataBtn = document.getElementById("resetDemoDataBtn");
    if (resetDataBtn) {
      resetDataBtn.onclick = () => {
        if (confirm("Reset all products, orders, and addresses back to initial demo data?")) {
          this.dataManager.resetAllDemoData();
          showDashToast("Demo data re-seeded to factory defaults!", "info");
          setTimeout(() => window.location.href='./404.html', 600);
        }
      };
    }
  }

  // --- Global Search across products and orders ---
  setupGlobalSearch() {
    const searchInput = document.getElementById("dashGlobalSearch");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        if (this.activeTab === "products") this.renderProductsTab();
        if (this.activeTab === "orders") this.renderOrdersTab();
        return;
      }

      if (this.activeTab === "products") {
        const filtered = this.dataManager.getProducts().filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          p.id.toLowerCase().includes(q)
        );
        this.renderProductsTab(filtered);
      } else if (this.activeTab === "orders") {
        const filtered = this.dataManager.getOrders().filter(o => 
          o.id.toLowerCase().includes(q) || 
          o.customer.name.toLowerCase().includes(q) || 
          o.customer.email.toLowerCase().includes(q)
        );
        this.renderOrdersTab(filtered);
      }
    });
  }

  // --- Modals Setup ---
  setupModals() {
    // Add Product Modal
    const addProdBtn = document.getElementById("openAddProductModalBtn");
    const modal = document.getElementById("adminAddProductModal");
    const closeBtn = document.getElementById("closeAddProdModalBtn");
    const form = document.getElementById("addProductForm");

    if (addProdBtn && modal) {
      addProdBtn.addEventListener("click", () => {
        form.reset();
        modal.classList.add("active");
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }

    // Modal background click close
    document.querySelectorAll(".dash-modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
        }
      });
    });

    // Form submit with JS validation
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("prodNameInput").value.trim();
        const cat = document.getElementById("prodCategorySelect").value;
        const price = parseFloat(document.getElementById("prodPriceInput").value);
        const stock = parseInt(document.getElementById("prodStockInput").value, 10);
        const desc = document.getElementById("prodDescInput").value.trim();

        if (!name) {
          alert("Please enter a gear title.");
          return;
        }

        if (isNaN(price) || price <= 0) {
          alert("Please enter a valid retail price.");
          return;
        }

        const newProd = this.dataManager.addProduct({
          name,
          category: cat,
          categoryLabel: cat.charAt(0).toUpperCase() + cat.slice(1),
          price,
          stockCount: isNaN(stock) ? 10 : stock,
          shortDesc: desc || "Engineered for extreme trail conditions."
        });

        showDashToast(`Product "${newProd.name}" added to catalog!`, "success");
        modal.classList.remove("active");
        this.renderProductsTab();
        this.renderOverviewTab();
      });
    }

    // Order modal close
    const orderModal = document.getElementById("adminOrderModal");
    const closeOrderBtn = document.getElementById("closeOrderModalBtn");
    if (closeOrderBtn && orderModal) {
      closeOrderBtn.addEventListener("click", () => orderModal.classList.remove("active"));
    }
  }

  openEditProductModal(productId) {
    const prod = this.dataManager.getProductById(productId);
    if (!prod) return;

    const newPrice = prompt(`Update price for "${prod.name}":`, prod.price);
    if (newPrice !== null && !isNaN(parseFloat(newPrice)) && parseFloat(newPrice) > 0) {
      this.dataManager.updateProduct(productId, { price: parseFloat(newPrice) });
      showDashToast(`Price updated to $${parseFloat(newPrice).toFixed(2)}`, "success");
      this.renderProductsTab();
    }
  }
}

/* ==========================================================================
   2. CUSTOMER DASHBOARD CONTROLLER
   ========================================================================== */
class CustomerDashboard {
  constructor() {
    this.dataManager = window.stacklyData;
    this.authManager = window.stacklyAuth;
    this.currentUser = this.authManager ? this.authManager.currentUser : null;
    this.activeTab = "overview";
    this.wishlistCategory = "all";
    this.wishlistSort = "default";
    this.rewardsCategory = "all";
    this.init();
  }

  init() {
    this.setupSidebarToggle();
    this.setupTabNavigation();
    this.renderCustomerHeader();
    this.renderOverviewTab();
    this.renderOrdersTab();
    this.renderWishlistTab();
    this.renderAddressesTab();
    this.renderRewardsTab();
    this.renderProfileTab();
    this.setupModals();
  }

  setupSidebarToggle() {
    const toggleBtn = document.getElementById("dashMobileToggle");
    const sidebar = document.getElementById("dashSidebar");
    const closeBtn = document.getElementById("dashSidebarClose");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));
    }

    if (sidebar) {
      sidebar.querySelectorAll(".dash-nav-link").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 1023) sidebar.classList.remove("open");
        });
      });
    }
  }

  setupTabNavigation() {
    const navLinks = document.querySelectorAll(".dash-nav-link[data-tab]");
    const tabPanes = document.querySelectorAll(".dash-tab-pane");
    const pageTitle = document.getElementById("dashPageTitle");
    const breadcrumbSub = document.getElementById("dashBreadcrumbSub");

    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-tab");
        if (!targetTab) return;

        this.activeTab = targetTab;
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        tabPanes.forEach(pane => {
          if (pane.id === `tab-${targetTab}`) {
            pane.classList.add("active");
          } else {
            pane.classList.remove("active");
          }
        });

        const tabTitle = link.getAttribute("data-title") || "Backcountry Portal";
        if (pageTitle) pageTitle.textContent = tabTitle;
        if (breadcrumbSub) breadcrumbSub.textContent = `CUSTOMER HUB / ${targetTab.toUpperCase()}`;

        if (targetTab === "overview") this.renderOverviewTab();
        if (targetTab === "orders") this.renderOrdersTab();
        if (targetTab === "wishlist") this.renderWishlistTab();
        if (targetTab === "addresses") this.renderAddressesTab();
        if (targetTab === "rewards") this.renderRewardsTab();
        if (targetTab === "profile") this.renderProfileTab();
      });
    });

    // Check initial URL hash (e.g. customer-dashboard.html#wishlist or #rewards)
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
      const targetLink = document.querySelector(`.dash-nav-link[data-tab="${initialHash}"]`);
      if (targetLink) targetLink.click();
    }
  }

  renderCustomerHeader() {
    const user = this.currentUser || { name: "Alex Rivers", trailPoints: 1450, tier: "Summit Explorer" };
    const nameEl = document.getElementById("custUserName");
    const tierEl = document.getElementById("custUserTier");
    const avatarEl = document.getElementById("custUserAvatar");

    if (nameEl) nameEl.textContent = user.name;
    if (tierEl) tierEl.textContent = user.tier || "Summit Explorer";
    if (avatarEl) avatarEl.textContent = user.name.charAt(0);

    const logoutBtn = document.getElementById("custLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (this.authManager) this.authManager.logout("login.html");
      });
    }
  }

  // --- TAB 1: OVERVIEW & ADVENTURE STATS ---
  renderOverviewTab() {
    const user = this.currentUser || { name: "Alex Rivers", trailPoints: 1450, tier: "Summit Explorer" };
    const email = user.email || "alex@backcountry.com";
    const orders = this.dataManager.getCustomerOrders(email);

    // Welcome banner details
    const bannerName = document.getElementById("custBannerName");
    const pointsVal = document.getElementById("custPointsVal");
    const pointsBar = document.getElementById("custPointsProgressBar");

    if (bannerName) bannerName.textContent = user.name;
    if (pointsVal) pointsVal.textContent = `${user.trailPoints || 1450} pts`;
    if (pointsBar) {
      const pct = Math.min(100, ((user.trailPoints || 1450) / 2000) * 100);
      pointsBar.style.width = `${pct}%`;
    }

    // Stat cards
    const activeShipmentsCount = orders.filter(o => o.fulfillmentStatus === "Shipped" || o.fulfillmentStatus === "Processing").length;
    const wishlistItems = (window.stacklyApp && window.stacklyApp.wishlist) ? window.stacklyApp.wishlist.length : 3;

    const elActiveShip = document.getElementById("statActiveShipments");
    const elTotalOrders = document.getElementById("statTotalOrders");
    const elWishlist = document.getElementById("statWishlistCount");

    if (elActiveShip) elActiveShip.textContent = activeShipmentsCount;
    if (elTotalOrders) elTotalOrders.textContent = Math.max(orders.length, 4);
    if (elWishlist) elWishlist.textContent = wishlistItems;

    // Active Shipment Tracker
    const latestShipment = orders.find(o => o.fulfillmentStatus === "Shipped") || orders[0];
    const trackerOrderId = document.getElementById("trackerOrderId");
    const trackerCarrier = document.getElementById("trackerCarrier");
    const trackerCode = document.getElementById("trackerCode");

    if (latestShipment) {
      if (trackerOrderId) trackerOrderId.textContent = `#${latestShipment.id}`;
      if (trackerCarrier) trackerCarrier.textContent = latestShipment.courier || "FedEx Trail Express";
      if (trackerCode) trackerCode.textContent = latestShipment.trackingNumber || "FDX-99281742US";
    }
  }

  // --- TAB 2: MY ORDERS & HISTORY ---
  renderOrdersTab(filteredOrders = null) {
    const user = this.currentUser || { email: "alex@backcountry.com" };
    const allOrders = this.dataManager.getCustomerOrders(user.email);
    const orders = filteredOrders || allOrders;
    const container = document.getElementById("customerOrdersList");
    const countBadge = document.getElementById("custOrdersCountBadge");

    if (countBadge) countBadge.textContent = orders.length;

    if (container) {
      if (orders.length === 0) {
        container.innerHTML = `
          <div style="text-align:center; padding:40px; background:#ffffff; border-radius:12px; border:1px solid var(--color-border);">
            <p style="color:var(--color-text-muted); margin-bottom:14px;">You haven't placed any backcountry gear orders yet.</p>
            <a href="shop.html" class="dash-btn dash-btn-primary">Explore Outdoor Gear <span class="material-symbols-outlined">arrow_forward</span></a>
          </div>
        `;
        return;
      }

      container.innerHTML = orders.map(o => `
        <div class="dash-panel" style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; padding-bottom:14px; border-bottom:1px solid var(--color-border);">
            <div>
              <strong style="font-size:1.05rem; color:var(--color-primary-green);">Order #${o.id}</strong>
              <div style="font-size:0.75rem; color:var(--color-text-muted); margin-top:2px;">Placed on ${o.date} &bull; Total: <strong>$${o.total.toFixed(2)}</strong></div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="status-pill ${o.fulfillmentStatus.toLowerCase()}">${o.fulfillmentStatus}</span>
              <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.customerDash.openReceiptModal('${o.id}')">Receipt Slip</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:14px; padding:16px 0;">
            ${o.items.map(item => `
              <div style="display:flex; align-items:center; gap:10px; background:var(--color-bg-cream); padding:10px; border-radius:8px;">
                <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; border-radius:6px; object-fit:cover; border:1px solid var(--color-border);" />
                <div>
                  <strong style="font-size:0.82rem; display:block; color:var(--color-text-dark);">${item.name}</strong>
                  <span style="font-size:0.72rem; color:var(--color-text-muted);">Qty: ${item.quantity} &bull; $${item.price.toFixed(2)}</span>
                </div>
              </div>
            `).join("")}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid var(--color-border); font-size:0.8rem;">
            <span style="color:var(--color-text-muted);">
              <span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; margin-right:4px;">local_shipping</span> Carrier: <strong>${o.courier || 'FedEx'}</strong> &bull; Tracking: <code style="background:#eef4f0; padding:2px 6px; border-radius:4px;">${o.trackingNumber || 'Pending'}</code>
            </span>
            <button class="dash-btn dash-btn-primary dash-btn-sm" onclick="window.customerDash.reorderItems('${o.id}')">
              Re-Order All Items
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  reorderItems(orderId) {
    const order = this.dataManager.getOrderById(orderId);
    if (!order || !window.stacklyCart) return;

    order.items.forEach(i => {
      window.stacklyCart.addItem(i.id, i.quantity);
    });

    showDashToast(`Added all ${order.items.length} items from order #${orderId} to your cart!`, "success");
  }

  openReceiptModal(orderId) {
    const order = this.dataManager.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("custReceiptModal");
    const content = document.getElementById("custReceiptContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center; padding-bottom:16px; border-bottom:1px solid var(--color-border);">
        <div style="font-family:var(--font-serif); font-size:1.35rem; font-weight:700; color:var(--color-primary-green);">[STACKLY OUTDOOR]</div>
        <p style="font-size:0.75rem; color:var(--color-text-muted);">Boulder Flagship &bull; Verified Carbon-Neutral Delivery</p>
      </div>

      <div style="display:flex; justify-content:space-between; margin-top:16px; font-size:0.84rem;">
        <div>
          <strong>Invoice ID:</strong> #${order.id}<br/>
          <strong>Date:</strong> ${order.date}<br/>
          <strong>Status:</strong> ${order.paymentStatus}
        </div>
        <div style="text-align:right;">
          <strong>Shipped To:</strong><br/>
          ${order.customer.name}<br/>
          ${order.customer.shippingAddress || "Boulder, Colorado"}
        </div>
      </div>

      <div style="margin-top:20px;">
        <table style="width:100%; border-collapse:collapse; font-size:0.84rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--color-border); text-align:left;">
              <th style="padding:6px 0;">Item Description</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(i => `
              <tr style="border-bottom:1px dashed var(--color-border);">
                <td style="padding:8px 0;">${i.name}</td>
                <td style="text-align:center;">${i.quantity}</td>
                <td style="text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px; padding-top:12px; border-top:1.5px solid var(--color-border); font-size:0.84rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Subtotal:</span><span>$${order.subtotal.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Shipping:</span><span>${order.shippingFee === 0 ? "FREE" : "$" + order.shippingFee.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Tax:</span><span>$${order.tax.toFixed(2)}</span></div>
        <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:800; color:var(--color-primary-green); margin-top:8px; padding-top:6px; border-top:1px solid var(--color-border);">
          <span>Total Paid:</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div style="margin-top:20px; text-align:center;">
        <button class="dash-btn dash-btn-outline" onclick="window.print()">Print Official Receipt</button>
      </div>
    `;

    modal.classList.add("active");
  }

  // --- TAB 3: WISHLIST & SAVED GEAR ---
  getWishlistIds() {
    if (this.dataManager && typeof this.dataManager.getWishlist === "function") {
      return this.dataManager.getWishlist();
    }
    const stored = localStorage.getItem("stackly_wishlist_items_v1");
    if (stored) {
      try {
        const p = JSON.parse(stored);
        if (Array.isArray(p) && p.length > 0) return p;
      } catch (e) {}
    }
    return ["prod-1", "prod-2", "prod-3", "prod-5", "prod-4", "prod-11"];
  }

  saveWishlistIds(ids) {
    if (this.dataManager && typeof this.dataManager.saveWishlist === "function") {
      this.dataManager.saveWishlist(ids);
    } else {
      localStorage.setItem("stackly_wishlist_items_v1", JSON.stringify(ids));
    }
    if (window.stacklyApp) {
      window.stacklyApp.wishlist = ids;
      if (typeof window.stacklyApp.updateWishlistUI === "function") window.stacklyApp.updateWishlistUI();
    }
  }

  renderWishlistTab() {
    const rawIds = this.getWishlistIds();
    const prods = rawIds.map(id => this.dataManager.getProductById(id)).filter(Boolean);

    // 1. Update KPI Analytics
    this.updateWishlistKpis(prods);

    // 2. Setup Category Filters & Sorter
    this.setupWishlistControls();

    // 3. Render Items Grid
    this.renderWishlistGrid(prods);

    // 4. Render Pack Checklist Planner
    this.renderPackChecklist();

    // 5. Render Recommended Additions
    this.renderWishlistRecommended(rawIds);
  }

  updateWishlistKpis(prods) {
    const rawIds = this.getWishlistIds();
    const countEl = document.getElementById("wishlistKpiCount");
    const weightEl = document.getElementById("wishlistKpiWeight");
    const valueEl = document.getElementById("wishlistKpiValue");
    const readinessEl = document.getElementById("wishlistKpiReadiness");
    const sidebarBadge = document.getElementById("custWishlistBadge");
    const overviewStat = document.getElementById("statWishlistCount");

    if (countEl) countEl.textContent = prods.length;
    if (sidebarBadge) sidebarBadge.textContent = prods.length;
    if (overviewStat) overviewStat.textContent = prods.length;

    // Weight calculation
    const weightMap = {
      "prod-1": 1.18, "prod-2": 0.92, "prod-3": 1.75, "prod-4": 0.31,
      "prod-5": 0.08, "prod-6": 0.58, "prod-7": 0.42, "prod-8": 0.12,
      "prod-9": 0.28, "prod-10": 0.85, "prod-11": 0.65, "prod-12": 1.10
    };
    let totalKg = 0;
    prods.forEach(p => {
      totalKg += weightMap[p.id] || 0.75;
    });
    const totalLbs = (totalKg * 2.20462).toFixed(1);
    if (weightEl) weightEl.textContent = `${totalKg.toFixed(2)} kg`;

    // Value calculation
    const totalVal = prods.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
    if (valueEl) valueEl.textContent = `$${totalVal.toFixed(2)}`;

    // Readiness calculation (Shelter, Sleep, Pack, Cooking, Lighting)
    const cats = new Set(prods.map(p => p.category));
    let covered = 0;
    if (cats.has("tents") || cats.has("shelter") || rawIds.includes("prod-1") || rawIds.includes("prod-11")) covered++;
    if (cats.has("sleeping") || rawIds.includes("prod-2")) covered++;
    if (cats.has("packs") || rawIds.includes("prod-3")) covered++;
    if (cats.has("cooking") || rawIds.includes("prod-5") || rawIds.includes("prod-7")) covered++;
    if (cats.has("lighting") || cats.has("power") || rawIds.includes("prod-4") || rawIds.includes("prod-9")) covered++;

    const readinessPct = Math.min(100, Math.round((covered / 5) * 100));
    if (readinessEl) readinessEl.textContent = `${readinessPct}%`;
  }

  setupWishlistControls() {
    const filterBtns = document.querySelectorAll(".wishlist-cat-btn");
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => {
          b.classList.remove("dash-btn-primary");
          b.classList.add("dash-btn-outline");
        });
        btn.classList.remove("dash-btn-outline");
        btn.classList.add("dash-btn-primary");
        this.wishlistCategory = btn.getAttribute("data-cat") || "all";
        const rawIds = this.getWishlistIds();
        const prods = rawIds.map(id => this.dataManager.getProductById(id)).filter(Boolean);
        this.renderWishlistGrid(prods);
      };
    });

    const sortSelect = document.getElementById("wishlistSortSelect");
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.wishlistSort = e.target.value;
        const rawIds = this.getWishlistIds();
        const prods = rawIds.map(id => this.dataManager.getProductById(id)).filter(Boolean);
        this.renderWishlistGrid(prods);
      };
    }
  }

  renderWishlistGrid(prods) {
    const container = document.getElementById("customerWishlistGrid");
    if (!container) return;

    let filtered = [...prods];
    if (this.wishlistCategory !== "all") {
      filtered = filtered.filter(p => {
        if (this.wishlistCategory === "tents") return p.category === "tents" || p.category === "shelter" || p.id === "prod-1" || p.id === "prod-11";
        if (this.wishlistCategory === "sleeping") return p.category === "sleeping" || p.id === "prod-2";
        if (this.wishlistCategory === "packs") return p.category === "packs" || p.id === "prod-3";
        if (this.wishlistCategory === "cooking") return p.category === "cooking" || p.id === "prod-5" || p.id === "prod-7";
        if (this.wishlistCategory === "lighting") return p.category === "lighting" || p.category === "power" || p.id === "prod-4" || p.id === "prod-6" || p.id === "prod-9";
        return p.category === this.wishlistCategory;
      });
    }

    // Sort
    const weightMap = {
      "prod-1": 1.18, "prod-2": 0.92, "prod-3": 1.75, "prod-4": 0.31,
      "prod-5": 0.08, "prod-6": 0.58, "prod-7": 0.42, "prod-8": 0.12,
      "prod-9": 0.28, "prod-10": 0.85, "prod-11": 0.65, "prod-12": 1.10
    };

    if (this.wishlistSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.wishlistSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.wishlistSort === "weight") {
      filtered.sort((a, b) => (weightMap[a.id] || 0.7) - (weightMap[b.id] || 0.7));
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:48px 24px; background:#ffffff; border-radius:12px; border:1px solid var(--color-border);">
          <span class="material-symbols-outlined" style="font-size:3rem; color:var(--color-gold); margin-bottom:12px;">backpack</span>
          <h4 style="font-family:var(--font-serif); font-size:1.2rem; color:var(--color-text-dark); margin-bottom:8px;">No Saved Gear in This Category</h4>
          <p style="color:var(--color-text-muted); margin-bottom:18px; max-width:440px; margin-left:auto; margin-right:auto;">
            Explore our outdoor store catalog to discover ultralight shelters, sleeping bags, stoves, and packs for your next adventure.
          </p>
          <a href="shop.html" class="dash-btn dash-btn-primary">Browse Gear Catalog <span class="material-symbols-outlined">arrow_forward</span></a>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const weight = weightMap[p.id] ? `${weightMap[p.id]} kg` : "0.75 kg";
      const isEssential = p.id === "prod-1" || p.id === "prod-2";
      const isHigh = p.id === "prod-3" || p.id === "prod-5";
      const priorityTag = isEssential ? "Essential Gear" : (isHigh ? "High Priority" : "Trip Wishlist");
      const priorityClass = isEssential ? "essential" : (isHigh ? "high" : "");

      const specSummary = p.specs ? Object.entries(p.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(" &bull; ") : p.shortDesc;

      return `
        <div class="wishlist-gear-card">
          <div>
            <div class="wishlist-img-box">
              <img src="${p.image}" alt="${p.name}" loading="lazy" />
              <span class="wishlist-priority-badge ${priorityClass}">${priorityTag}</span>
              <span class="wishlist-weight-chip">
                <span class="material-symbols-outlined" style="font-size:0.85rem;">scale</span> ${weight}
              </span>
            </div>

            <div class="wishlist-gear-meta">
              <span class="wishlist-cat-label">${p.categoryLabel || "Backcountry Equipment"}</span>
              <h4 class="wishlist-gear-title" title="${p.name}">${p.name}</h4>
              <p class="wishlist-specs-snippet">${specSummary}</p>
            </div>
          </div>

          <div>
            <div class="wishlist-pricing-row">
              <div>
                <span class="wishlist-price-val">$${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<span class="wishlist-original-price">$${p.originalPrice.toFixed(2)}</span>` : ""}
              </div>
              <span class="stock-pill in-stock">&bull; In Stock</span>
            </div>

            <div class="wishlist-card-actions">
              <button class="dash-btn dash-btn-primary dash-btn-sm" style="flex:1; justify-content:center;" onclick="window.customerDash.addWishlistToCart('${p.id}')">
                <span class="material-symbols-outlined" style="font-size:1rem; margin-right:4px;">shopping_bag</span> Add to Cart
              </button>
              <button class="action-icon-btn delete" onclick="window.customerDash.removeWishlistItem('${p.id}')" title="Remove from Wishlist">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  addWishlistToCart(productId) {
    const product = this.dataManager.getProductById(productId);
    if (!product) return;

    if (window.stacklyCart) {
      const existing = window.stacklyCart.items.find(i => i.id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        window.stacklyCart.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      window.stacklyCart.saveCart();
      if (typeof window.stacklyCart.updateBadges === "function") window.stacklyCart.updateBadges();
    }
    showDashToast(`Added "${product.name}" to your expedition cart!`, "success");
  }

  moveAllWishlistToCart() {
    const rawIds = this.getWishlistIds();
    const prods = rawIds.map(id => this.dataManager.getProductById(id)).filter(Boolean);
    if (prods.length === 0) {
      showDashToast("Your wishlist is empty.", "info");
      return;
    }
    let addedCount = 0;
    prods.forEach(p => {
      if (p.inStock) {
        if (window.stacklyCart) {
          const existing = window.stacklyCart.items.find(i => i.id === p.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            window.stacklyCart.items.push({
              id: p.id,
              name: p.name,
              price: p.price,
              image: p.image,
              quantity: 1
            });
          }
          addedCount++;
        }
      }
    });
    if (window.stacklyCart) {
      window.stacklyCart.saveCart();
      if (typeof window.stacklyCart.updateBadges === "function") window.stacklyCart.updateBadges();
    }
    showDashToast(`Moved ${addedCount} wishlist items to your cart!`, "success");
  }

  removeWishlistItem(productId) {
    let list = this.getWishlistIds();
    const idx = list.indexOf(productId);
    if (idx > -1) {
      list.splice(idx, 1);
      this.saveWishlistIds(list);
      showDashToast("Item removed from your adventure wishlist.", "info");
      this.renderWishlistTab();
    }
  }

  shareWishlist() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=wishlist&expedition=rockies-2026`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showDashToast("Wishlist link copied to clipboard! Share with your trail crew.", "success");
      }).catch(() => {
        showDashToast(`Wishlist link: ${shareUrl}`, "info");
      });
    } else {
      showDashToast(`Wishlist link: ${shareUrl}`, "info");
    }
  }

  // --- Pack Checklist Planner ---
  renderPackChecklist() {
    const container = document.getElementById("packChecklistContainer");
    if (!container) return;

    const defaultChecklist = [
      { id: "chk-1", cat: "Shelter & Bivouac", name: "Summit Ridge 2P Ultralight Tent", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-2", cat: "Shelter & Bivouac", name: "Waterproof Ground Footprint & DAC Stakes", tag: "Packed", tagClass: "packed", defaultChecked: true },
      { id: "chk-3", cat: "Shelter & Bivouac", name: "High-Wind Reflective Guylines (4x)", tag: "Packed", tagClass: "packed", defaultChecked: true },
      
      { id: "chk-4", cat: "Sleep System", name: "Sub-Zero 850-Fill Down Sleeping Bag", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-5", cat: "Sleep System", name: "Insulated R-Value 4.8 Sleeping Pad", tag: "Packed", tagClass: "packed", defaultChecked: true },
      { id: "chk-6", cat: "Sleep System", name: "Ultralight Inflatable Camp Pillow", tag: "Packed", tagClass: "packed", defaultChecked: true },

      { id: "chk-7", cat: "Cookware & Hydration", name: "Titanium Ultralight Camp Stove", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-8", cat: "Cookware & Hydration", name: "Backcountry Thermal Flask (1L)", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-9", cat: "Cookware & Hydration", name: "Micro-Filtration 0.1 Micron Squeeze Filter", tag: "Need", tagClass: "need", defaultChecked: false },

      { id: "chk-10", cat: "Navigation & Safety", name: "Trailblazer Tactical Compass", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-11", cat: "Navigation & Safety", name: "Beacon 500 Lumen Solar Camping Lantern", tag: "Wishlisted", tagClass: "wishlist", defaultChecked: false },
      { id: "chk-12", cat: "Navigation & Safety", name: "Wilderness Trauma Medical Kit", tag: "Packed", tagClass: "packed", defaultChecked: true }
    ];

    let savedState = {};
    try {
      const s = localStorage.getItem("stackly_pack_checklist_v1");
      if (s) savedState = JSON.parse(s);
    } catch (e) {}

    const categories = ["Shelter & Bivouac", "Sleep System", "Cookware & Hydration", "Navigation & Safety"];
    const catIcons = {
      "Shelter & Bivouac": "cabin",
      "Sleep System": "bed",
      "Cookware & Hydration": "skillet",
      "Navigation & Safety": "explore"
    };

    let totalItems = defaultChecklist.length;
    let checkedItems = 0;

    const html = categories.map(cat => {
      const items = defaultChecklist.filter(item => item.cat === cat);
      const itemsHtml = items.map(item => {
        const isChecked = typeof savedState[item.id] !== "undefined" ? savedState[item.id] : item.defaultChecked;
        if (isChecked) checkedItems++;
        return `
          <div class="checklist-row ${isChecked ? 'checked' : ''}" onclick="window.customerDash.toggleChecklistItem('${item.id}')">
            <div class="checklist-left">
              <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); window.customerDash.toggleChecklistItem('${item.id}')" />
              <span>${item.name}</span>
            </div>
            <span class="checklist-tag ${item.tagClass}">${item.tag}</span>
          </div>
        `;
      }).join("");

      return `
        <div class="checklist-cat-card">
          <div class="checklist-cat-header">
            <span class="checklist-cat-title">
              <span class="material-symbols-outlined" style="font-size:1.1rem; color:var(--color-primary-green);">${catIcons[cat] || 'check'}</span>
              ${cat}
            </span>
            <span style="font-size:0.75rem; color:var(--color-text-muted);">${items.length} Items</span>
          </div>
          <div class="checklist-items-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = html;

    // Progress updates
    const pct = Math.round((checkedItems / totalItems) * 100);
    const summaryEl = document.getElementById("checklistProgressSummary");
    const barEl = document.getElementById("checklistProgressBar");
    if (summaryEl) summaryEl.textContent = `${checkedItems} / ${totalItems} Items Prepared (${pct}%)`;
    if (barEl) barEl.style.width = `${pct}%`;
  }

  toggleChecklistItem(id) {
    let savedState = {};
    try {
      const s = localStorage.getItem("stackly_pack_checklist_v1");
      if (s) savedState = JSON.parse(s);
    } catch (e) {}

    const cur = typeof savedState[id] !== "undefined" ? savedState[id] : false;
    savedState[id] = !cur;
    localStorage.setItem("stackly_pack_checklist_v1", JSON.stringify(savedState));
    this.renderPackChecklist();
  }

  resetChecklist() {
    localStorage.removeItem("stackly_pack_checklist_v1");
    showDashToast("Expedition checklist reset to default pack values.", "info");
    this.renderPackChecklist();
  }

  // --- Recommended Additions ---
  renderWishlistRecommended(wishlistIds) {
    const container = document.getElementById("wishlistRecommendedGrid");
    if (!container) return;

    const recommendedList = [
      { id: "prod-6", reason: "Pair with Beacon Lantern for infinite solar energy off-grid." },
      { id: "prod-8", reason: "Essential navigation backup when electronics lose battery in cold cols." },
      { id: "prod-7", reason: "Keeps 1L of water steaming hot through sub-zero alpine bivouacs." },
      { id: "prod-10", reason: "High-carbon steel for basecamp fire prep and shelter construction." }
    ];

    const unadded = recommendedList
      .filter(item => !wishlistIds.includes(item.id))
      .map(item => ({ ...this.dataManager.getProductById(item.id), reason: item.reason }))
      .filter(p => p && p.id);

    if (unadded.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:24px; background:#ffffff; border-radius:8px; border:1px solid var(--color-border); font-size:0.85rem; color:var(--color-text-muted);">
          You have added all recommended field essentials to your saved gear list!
        </div>
      `;
      return;
    }

    container.innerHTML = unadded.map(p => `
      <div class="recommended-gear-card">
        <div>
          <div class="rec-img-box">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
          </div>
          <span style="font-size:0.7rem; font-weight:700; color:var(--color-primary-green); text-transform:uppercase;">${p.categoryLabel}</span>
          <strong style="display:block; font-size:0.95rem; color:var(--color-text-dark); margin:4px 0 6px;">${p.name}</strong>
          <p style="font-size:0.78rem; color:var(--color-text-muted); line-height:1.4; margin-bottom:12px;">${p.reason}</p>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <strong style="color:var(--color-primary-green); font-size:1.1rem;">$${p.price.toFixed(2)}</strong>
            <span class="stock-pill in-stock">&bull; In Stock</span>
          </div>
          <button class="dash-btn dash-btn-outline dash-btn-sm" style="width:100%; justify-content:center;" onclick="window.customerDash.addRecommendedToWishlist('${p.id}')">
            <span class="material-symbols-outlined" style="font-size:1rem; margin-right:4px;">bookmark_add</span> + Add to Wishlist
          </button>
        </div>
      </div>
    `).join("");
  }

  addRecommendedToWishlist(productId) {
    let list = this.getWishlistIds();
    if (!list.includes(productId)) {
      list.push(productId);
      this.saveWishlistIds(list);
      const prod = this.dataManager.getProductById(productId);
      showDashToast(`Added "${prod ? prod.name : 'Item'}" to your adventure wishlist!`, "success");
      this.renderWishlistTab();
    }
  }

  // --- TAB 4: SAVED ADDRESSES & PAYMENT METHODS ---
  renderAddressesTab() {
    const user = this.currentUser || { id: "usr-cust-01" };
    const addresses = this.dataManager.getAddresses(user.id);
    const payments = this.dataManager.getPaymentCards(user.id);

    const addrContainer = document.getElementById("customerAddressList");
    if (addrContainer) {
      addrContainer.innerHTML = addresses.map(a => `
        <div class="address-item-card ${a.isDefault ? 'is-default' : ''}">
          <div class="card-top-row">
            <span class="card-label-badge ${a.isDefault ? 'default-tag' : ''}">
              ${a.isDefault ? 'Default Shipping' : a.label}
            </span>
            ${!a.isDefault ? `<button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.customerDash.setDefaultAddress('${a.id}')">Set Default</button>` : ''}
          </div>
          <div class="card-middle-content">
            <strong>${a.fullName}</strong>
            <p>${a.street} ${a.apt ? a.apt + ', ' : ''}<br/>${a.city}, ${a.state} ${a.zip}<br/>${a.country}<br/>${a.phone}</p>
          </div>
          <div class="card-bottom-actions">
            <span style="font-size:0.75rem; color:var(--color-text-muted);">Verified Trail Delivery</span>
            <button class="action-icon-btn delete" onclick="window.customerDash.deleteAddress('${a.id}')" title="Delete Address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `).join("");
    }

    const payContainer = document.getElementById("customerPaymentList");
    if (payContainer) {
      payContainer.innerHTML = payments.map(c => `
        <div class="payment-item-card ${c.isDefault ? 'is-default' : ''}">
          <div class="card-top-row">
            <span class="card-label-badge ${c.isDefault ? 'default-tag' : ''}">
              ${c.isDefault ? 'Default Card' : c.cardBrand}
            </span>
            <span class="material-symbols-outlined" style="font-size:1.4rem; color:var(--color-gold);">credit_card</span>
          </div>
          <div class="card-middle-content">
            <strong>•••• •••• •••• ${c.last4}</strong>
            <p>Holder: ${c.cardHolder}<br/>Expires: ${c.expiry}</p>
          </div>
          <div class="card-bottom-actions">
            <span style="font-size:0.75rem; color:var(--color-text-muted);">256-bit Encrypted</span>
            <button class="action-icon-btn delete" onclick="window.customerDash.deletePayment('${c.id}')" title="Remove Card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  setDefaultAddress(addrId) {
    const user = this.currentUser || { id: "usr-cust-01" };
    this.dataManager.setDefaultAddress(addrId, user.id);
    showDashToast("Default shipping address updated!", "success");
    this.renderAddressesTab();
  }

  deleteAddress(addrId) {
    if (confirm("Remove this saved shipping address?")) {
      this.dataManager.deleteAddress(addrId);
      showDashToast("Shipping address removed.", "info");
      this.renderAddressesTab();
    }
  }

  deletePayment(cardId) {
    if (confirm("Remove this saved payment card?")) {
      this.dataManager.deletePaymentCard(cardId);
      showDashToast("Payment card removed.", "info");
      this.renderAddressesTab();
    }
  }

  // --- TAB 7: TRAIL CLUB & REWARDS ---
  renderRewardsTab() {
    const user = this.currentUser || { id: "usr-cust-01", name: "Alex Rivers", trailPoints: 1450, tier: "Summit Explorer" };
    const points = user.trailPoints || 1450;
    const vouchers = this.dataManager.getVouchers();

    // 1. Update Points Displays Across Dashboard
    const heroPoints = document.getElementById("rewardsHeroPoints");
    const headerPoints = document.getElementById("rewardsPointsBalance");
    const sidebarBadge = document.getElementById("custRewardsBadge");
    const overviewPoints = document.getElementById("custPointsVal");
    const progressBar = document.getElementById("rewardsHeroProgressBar");
    const nextTierHint = document.getElementById("rewardsNextTierHint");

    if (heroPoints) heroPoints.textContent = points.toLocaleString();
    if (headerPoints) headerPoints.textContent = `${points.toLocaleString()} Points`;
    if (sidebarBadge) sidebarBadge.textContent = `${points.toLocaleString()} pts`;
    if (overviewPoints) overviewPoints.textContent = `${points.toLocaleString()} pts`;

    // Alpine Legend tier is at 1,800 points
    const remainingToNext = Math.max(0, 1800 - points);
    if (nextTierHint) {
      nextTierHint.textContent = remainingToNext > 0 
        ? `${remainingToNext.toLocaleString()} pts to Alpine Legend Tier`
        : "Alpine Legend Tier Achieved!";
    }
    if (progressBar) {
      const pct = Math.min(100, Math.max(15, Math.round((points / 1800) * 100)));
      progressBar.style.width = `${pct}%`;
    }

    // 2. Setup Category Filters
    this.setupRewardsControls();

    // 3. Render Vouchers Grid
    this.renderVouchersGrid(vouchers, points);

    // 4. Render Trail Missions (Ways to Earn)
    this.renderTrailMissions();

    // 5. Render Badges & Achievements
    this.renderTrailBadges(points);

    // 6. Render Claimed Rewards Wallet
    this.renderClaimedWallet(vouchers);
  }

  setupRewardsControls() {
    const filterBtns = document.querySelectorAll(".reward-filter-btn");
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        filterBtns.forEach(b => {
          b.classList.remove("dash-btn-primary");
          b.classList.add("dash-btn-outline");
        });
        btn.classList.remove("dash-btn-outline");
        btn.classList.add("dash-btn-primary");
        this.rewardsCategory = btn.getAttribute("data-cat") || "all";
        const vouchers = this.dataManager.getVouchers();
        const user = this.currentUser || { trailPoints: 1450 };
        this.renderVouchersGrid(vouchers, user.trailPoints || 1450);
      };
    });
  }

  renderVouchersGrid(vouchers, points) {
    const container = document.getElementById("customerVouchersGrid");
    if (!container) return;

    let filtered = [...vouchers];
    if (this.rewardsCategory !== "all") {
      filtered = filtered.filter(v => v.category === this.rewardsCategory);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:36px; background:#ffffff; border-radius:10px; border:1px solid var(--color-border); color:var(--color-text-muted);">
          No rewards found in this category.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(v => {
      const canAfford = points >= v.pointsRequired;
      const isRedeemed = !!v.redeemed;

      return `
        <div class="reward-voucher-card">
          <div class="reward-card-media">
            <img src="${v.image || 'assets/images/products/prod-flask.webp'}" alt="${v.title}" loading="lazy" />
            <span class="reward-badge-overlay">${v.badge || 'Trail Reward'}</span>
            <span class="reward-cost-overlay">
              <span class="material-symbols-outlined" style="font-size:0.9rem;">stars</span> ${v.pointsRequired} Pts
            </span>
          </div>

          <div class="reward-card-body">
            <div>
              <span class="reward-category-tag">${v.categoryLabel || 'Member Reward'}</span>
              <h4 class="reward-card-title">${v.title}</h4>
              <p class="reward-card-desc">${v.description}</p>
            </div>

            <div>
              <div class="reward-card-meta">
                ${v.minSpend > 0 ? `Min. spend: $${v.minSpend.toFixed(2)} &bull; ` : ""}Valid thru ${v.expiryDate}
              </div>

              ${isRedeemed ? `
                <div class="reward-redeemed-box">
                  <span class="wallet-voucher-code" style="font-size:0.85rem; padding:4px 8px;">${v.code}</span>
                  <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.customerDash.copyVoucherCode('${v.code}')">Copy</button>
                </div>
              ` : (canAfford ? `
                <button class="dash-btn dash-btn-primary" style="width:100%; justify-content:center;" onclick="window.customerDash.claimVoucher('${v.id}')">
                  Redeem for ${v.pointsRequired} Pts
                </button>
              ` : `
                <button class="dash-btn dash-btn-outline" style="width:100%; justify-content:center; opacity:0.6; cursor:not-allowed;" title="Earn ${v.pointsRequired - points} more points to redeem">
                  Need ${v.pointsRequired - points} More Pts
                </button>
              `)}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  claimVoucher(voucherId) {
    const user = this.currentUser || { id: "usr-cust-01", name: "Alex Rivers", trailPoints: 1450 };
    const res = this.dataManager.redeemVoucher(voucherId, user);

    if (res.success) {
      if (this.currentUser) this.currentUser.trailPoints = res.newPoints;
      showDashToast(`Reward unlocked! Your promo code is: ${res.voucher.code}`, "success");
      this.renderRewardsTab();
      this.renderOverviewTab();
      this.renderCustomerHeader();
    } else {
      showDashToast(res.message, "error");
    }
  }

  copyVoucherCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        showDashToast(`Coupon code "${code}" copied to clipboard!`, "success");
      }).catch(() => {
        showDashToast(`Promo Code: ${code}`, "info");
      });
    } else {
      showDashToast(`Promo Code: ${code}`, "info");
    }
  }

  renderTrailMissions() {
    const container = document.getElementById("trailMissionsGrid");
    if (!container) return;

    let completed = [];
    try {
      const s = localStorage.getItem("stackly_completed_missions_v1");
      if (s) completed = JSON.parse(s);
    } catch (e) {}

    const missions = [
      {
        id: "miss-photo",
        icon: "photo_camera",
        title: "Summit Photo & Field Report",
        desc: "Upload a photo of your Stackly tent, stove, or pack on the mountain trail.",
        pts: "+150 Pts",
        btnText: "Submit Field Photo",
        btnAction: "window.customerDash.completeTrailMission('miss-photo')"
      },
      {
        id: "miss-review",
        icon: "rate_review",
        title: "Verified Field Gear Review",
        desc: "Help fellow backpackers by reviewing the durability of your purchased gear.",
        pts: "+100 Pts",
        btnText: "Write Gear Review",
        btnAction: "window.customerDash.completeTrailMission('miss-review')"
      },
      {
        id: "miss-pledge",
        icon: "forest",
        title: "Leave No Trace Stewardship Pledge",
        desc: "Commit to outdoor conservation and sustainable low-impact camping principles.",
        pts: "+150 Pts",
        btnText: "Sign Eco Pledge",
        btnAction: "window.customerDash.completeTrailMission('miss-pledge')"
      },
      {
        id: "miss-miles",
        icon: "hiking",
        title: "Trail Mile Tracker (Log 25 Miles)",
        desc: "Sync your backcountry GPS trail log or log manual wilderness mileage.",
        pts: "+200 Pts",
        btnText: "Log Trail Miles",
        btnAction: "window.customerDash.completeTrailMission('miss-miles')"
      },
      {
        id: "miss-refer",
        icon: "group_add",
        title: "Invite an Expedition Partner",
        desc: "Give a fellow hiker $20 off their first order, earn 300 points when they shop.",
        pts: "+300 Pts",
        btnText: "Copy Invite Link",
        btnAction: "window.customerDash.completeTrailMission('miss-refer')"
      }
    ];

    container.innerHTML = missions.map(m => {
      const isDone = completed.includes(m.id);
      return `
        <div class="trail-mission-card">
          <div>
            <div class="mission-top-row">
              <div class="mission-icon-box">
                <span class="material-symbols-outlined">${m.icon}</span>
              </div>
              <span class="mission-points-tag">${m.pts}</span>
            </div>
            <strong style="font-size:0.95rem; color:var(--color-text-dark); display:block; margin:12px 0 6px;">${m.title}</strong>
            <p style="font-size:0.8rem; color:var(--color-text-body); line-height:1.45;">${m.desc}</p>
          </div>

          <div>
            ${isDone ? `
              <div style="display:flex; align-items:center; gap:6px; color:#065f46; font-size:0.8rem; font-weight:700; background:#ecfdf5; padding:8px 12px; border-radius:6px; border:1px solid #a7f3d0;">
                <span class="material-symbols-outlined" style="font-size:1rem;">check_circle</span> Completed &bull; Points Awarded
              </div>
            ` : `
              <button class="dash-btn dash-btn-outline dash-btn-sm" style="width:100%; justify-content:center;" onclick="${m.btnAction}">
                ${m.btnText}
              </button>
            `}
          </div>
        </div>
      `;
    }).join("");
  }

  completeTrailMission(missionId) {
    const user = this.currentUser || { id: "usr-cust-01", name: "Alex Rivers", trailPoints: 1450 };
    let pointsToAdd = 0;
    let msg = "";

    let completed = [];
    try {
      const s = localStorage.getItem("stackly_completed_missions_v1");
      if (s) completed = JSON.parse(s);
    } catch (e) {}

    if (completed.includes(missionId)) {
      showDashToast("You have already claimed points for this trail mission!", "info");
      return;
    }

    if (missionId === "miss-pledge") {
      pointsToAdd = 150;
      msg = "Leave No Trace Stewardship Pledge signed! +150 Trail Points awarded.";
    } else if (missionId === "miss-miles") {
      pointsToAdd = 200;
      msg = "25 Backcountry Trail Miles verified! +200 Trail Points awarded.";
    } else if (missionId === "miss-review") {
      pointsToAdd = 100;
      msg = "Field gear review verified! +100 Trail Points awarded.";
    } else if (missionId === "miss-photo") {
      pointsToAdd = 150;
      msg = "Summit photo accepted for community trail gallery! +150 Trail Points awarded.";
    } else if (missionId === "miss-refer") {
      const link = `${window.location.origin}${window.location.pathname}?ref=ALEX-RIVERS-TRAIL`;
      navigator.clipboard.writeText(link);
      showDashToast(`Referral link copied to clipboard! Share with your trail crew.`, "success");
      return;
    }

    user.trailPoints = (user.trailPoints || 1450) + pointsToAdd;
    completed.push(missionId);
    localStorage.setItem("stackly_completed_missions_v1", JSON.stringify(completed));

    if (window.stacklyAuth) {
      window.stacklyAuth.setCurrentUser(user);
      const users = window.stacklyAuth.getUsers();
      const uIdx = users.findIndex(u => u.id === user.id);
      if (uIdx > -1) {
        users[uIdx].trailPoints = user.trailPoints;
        window.stacklyAuth.saveUsers(users);
      }
    }

    showDashToast(msg, "success");
    this.renderRewardsTab();
    this.renderOverviewTab();
    this.renderCustomerHeader();
  }

  renderTrailBadges(points) {
    const container = document.getElementById("trailBadgesGrid");
    if (!container) return;

    let completed = [];
    try {
      const s = localStorage.getItem("stackly_completed_missions_v1");
      if (s) completed = JSON.parse(s);
    } catch (e) {}
    const pledgeSigned = completed.includes("miss-pledge");

    const badges = [
      { id: "b-1", name: "First Ascent Pioneer", desc: "Completed your first official expedition order.", icon: "military_tech", unlocked: true },
      { id: "b-2", name: "Leave No Trace Ambassador", desc: "Signed the national wilderness stewardship accord.", icon: "eco", unlocked: pledgeSigned },
      { id: "b-3", name: "Campfire Gourmet", desc: "Equipped with titanium stove and thermal cookware.", icon: "local_fire_department", unlocked: true },
      { id: "b-4", name: "Sub-Zero Alpine Master", desc: "Equipped with 850-fill down for winter high camps.", icon: "ac_unit", unlocked: false, progress: "60% Complete" },
      { id: "b-5", name: "Continental Divide Peakbagger", desc: "Reach 3 summits above 10,000 ft elevation.", icon: "landscape", unlocked: false, progress: "1 / 3 Summits" },
      { id: "b-6", name: "Trail Legend VIP", desc: "Accumulate 2,500 lifetime trail loyalty points.", icon: "workspace_premium", unlocked: points >= 2500, progress: `${points} / 2,500 pts` }
    ];

    container.innerHTML = badges.map(b => `
      <div class="badge-item-card ${b.unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon-disc">
          <span class="material-symbols-outlined">${b.icon}</span>
        </div>
        <strong class="badge-name">${b.name}</strong>
        <p class="badge-desc">${b.desc}</p>
        <span class="badge-status-pill ${b.unlocked ? 'unlocked' : 'locked'}">
          ${b.unlocked ? 'Unlocked' : (b.progress || 'Locked')}
        </span>
      </div>
    `).join("");
  }

  renderClaimedWallet(vouchers) {
    const container = document.getElementById("customerClaimedWallet");
    if (!container) return;

    const redeemed = vouchers.filter(v => v.redeemed);
    if (redeemed.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--color-text-muted); font-size:0.85rem;">
          No vouchers redeemed yet. Select a reward above to convert your points into promo codes!
        </div>
      `;
      return;
    }

    container.innerHTML = redeemed.map(v => `
      <div class="wallet-voucher-card">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${v.image || 'assets/images/products/prod-flask.webp'}" alt="${v.title}" style="width:48px; height:48px; border-radius:6px; object-fit:cover; background:#f7f4ee;" />
          <div>
            <strong style="font-size:0.92rem; color:var(--color-text-dark); display:block;">${v.title}</strong>
            <span style="font-size:0.75rem; color:var(--color-text-muted);">Redeemed on ${v.redeemedDate || 'Recent'} &bull; Valid thru ${v.expiryDate}</span>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <span class="wallet-voucher-code">${v.code}</span>
          <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.customerDash.copyVoucherCode('${v.code}')">Copy</button>
        </div>
      </div>
    `).join("");
  }

  // --- TAB 6: PROFILE & PREFERENCES ---
  renderProfileTab() {
    const user = this.currentUser || { name: "Alex Rivers", email: "alex@backcountry.com", phone: "+1 (303) 847-2910" };
    const nameInput = document.getElementById("profileNameInput");
    const emailInput = document.getElementById("profileEmailInput");
    const phoneInput = document.getElementById("profilePhoneInput");

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";

    const form = document.getElementById("profileDetailsForm");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        user.name = nameInput.value.trim();
        user.phone = phoneInput.value.trim();

        if (this.authManager) {
          this.authManager.setCurrentUser(user);
        }
        showDashToast("Profile details updated successfully!", "success");
        this.renderCustomerHeader();
      };
    }

    const passForm = document.getElementById("profilePasswordForm");
    if (passForm) {
      passForm.onsubmit = (e) => {
        e.preventDefault();
        const currentPass = document.getElementById("currPassInput").value;
        const newPass = document.getElementById("newPassInput").value;
        const confirmPass = document.getElementById("confirmPassInput").value;

        if (newPass.length < 5) {
          showDashToast("New password must be at least 5 characters.", "error");
          return;
        }

        if (newPass !== confirmPass) {
          showDashToast("Passwords do not match.", "error");
          return;
        }

        user.password = newPass;
        if (this.authManager) {
          this.authManager.setCurrentUser(user);
        }
        showDashToast("Password changed successfully!", "success");
        passForm.reset();
      };
    }
  }

  // --- Modals Setup ---
  setupModals() {
    const addAddrBtn = document.getElementById("openAddAddressModalBtn");
    const modalAddr = document.getElementById("custAddAddressModal");
    const closeAddrBtn = document.getElementById("closeAddAddrModalBtn");
    const addrForm = document.getElementById("custAddressForm");

    if (addAddrBtn && modalAddr) {
      addAddrBtn.addEventListener("click", () => modalAddr.classList.add("active"));
    }
    if (closeAddrBtn && modalAddr) {
      closeAddrBtn.addEventListener("click", () => modalAddr.classList.remove("active"));
    }

    if (addrForm) {
      addrForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = this.currentUser || { id: "usr-cust-01" };
        const label = document.getElementById("addrLabelInput").value.trim() || "Delivery Point";
        const fName = document.getElementById("addrFullNameInput").value.trim();
        const street = document.getElementById("addrStreetInput").value.trim();
        const city = document.getElementById("addrCityInput").value.trim();
        const state = document.getElementById("addrStateInput").value.trim();
        const zip = document.getElementById("addrZipInput").value.trim();
        const phone = document.getElementById("addrPhoneInput").value.trim();
        const isDef = document.getElementById("addrDefaultCheck").checked;

        if (!fName || !street || !city) {
          alert("Please fill in required fields.");
          return;
        }

        this.dataManager.addAddress({
          userId: user.id,
          label,
          fullName: fName,
          street,
          city,
          state,
          zip,
          country: "United States",
          phone: phone || "+1 (555) 012-3456",
          isDefault: isDef
        });

        showDashToast("New shipping address added!", "success");
        modalAddr.classList.remove("active");
        addrForm.reset();
        this.renderAddressesTab();
      });
    }

    // Receipt close
    const receiptModal = document.getElementById("custReceiptModal");
    const closeReceiptBtn = document.getElementById("closeReceiptModalBtn");
    if (closeReceiptBtn && receiptModal) {
      closeReceiptBtn.addEventListener("click", () => receiptModal.classList.remove("active"));
    }
  }
}
