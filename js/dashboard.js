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
    const user = this.currentUser || { name: "Marcus Thorne", roleLabel: "Store Administrator" };
    const nameEl = document.getElementById("adminUserName");
    const roleEl = document.getElementById("adminUserRole");
    const avatarEl = document.getElementById("adminUserAvatar");

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.roleLabel || "Store Administrator";
    if (avatarEl) avatarEl.textContent = user.name.charAt(0);

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
              <strong style="font-size: 0.84rem; color: #991b1b;">⚠️ ${p.name}</strong>
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
              <span style="font-size:0.75rem; color:var(--color-gold-hover);">★ ${p.rating || 5.0} (${p.reviewCount || 1})</span>
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

    if (storeNameInput) storeNameInput.value = settings.storeName;
    if (supportEmailInput) supportEmailInput.value = settings.supportEmail;
    if (phoneInput) phoneInput.value = settings.phone;
    if (freeShipInput) freeShipInput.value = settings.freeShippingThreshold;
    if (taxRateInput) taxRateInput.value = settings.taxRatePercent;

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
            <a href="shop.html" class="dash-btn dash-btn-primary">Explore Outdoor Gear &rarr;</a>
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
              🚚 Carrier: <strong>${o.courier || 'FedEx'}</strong> &bull; Tracking: <code style="background:#eef4f0; padding:2px 6px; border-radius:4px;">${o.trackingNumber || 'Pending'}</code>
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
  renderWishlistTab() {
    const container = document.getElementById("customerWishlistGrid");
    const rawIds = (window.stacklyApp && window.stacklyApp.wishlist) ? window.stacklyApp.wishlist : ["prod-1", "prod-3", "prod-5"];
    
    if (container) {
      const prods = rawIds.map(id => this.dataManager.getProductById(id)).filter(Boolean);
      
      if (prods.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding:40px; background:#ffffff; border-radius:12px; border:1px solid var(--color-border);">
            <p style="color:var(--color-text-muted); margin-bottom:14px;">Your saved gear trail bag is empty.</p>
            <a href="shop.html" class="dash-btn dash-btn-primary">Browse Catalog &rarr;</a>
          </div>
        `;
        return;
      }

      container.innerHTML = prods.map(p => `
        <div class="dash-panel" style="padding:16px; position:relative;">
          <img src="${p.image}" alt="${p.name}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:12px; background:var(--color-bg-cream);" />
          <span class="card-label-badge" style="margin-bottom:6px;">${p.categoryLabel}</span>
          <strong style="font-size:0.9rem; display:block; margin-bottom:6px; color:var(--color-text-dark);">${p.name}</strong>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <strong style="font-size:1.1rem; color:var(--color-primary-green);">$${p.price.toFixed(2)}</strong>
            <span class="stock-tag in-stock">In Stock</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="dash-btn dash-btn-primary dash-btn-sm" style="flex:1; justify-content:center;" onclick="window.location.href='./404.html'">
              Add to Cart
            </button>
            <button class="action-icon-btn delete" onclick="window.location.href='./404.html'" title="Remove">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `).join("");
    }
  }

  addWishlistToCart(productId) {
    if (window.stacklyCart) {
      window.stacklyCart.addItem(productId, 1);
    }
  }

  removeWishlistItem(productId) {
    if (window.stacklyApp) {
      window.stacklyApp.toggleWishlist(productId);
    }
    this.renderWishlistTab();
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
            <span style="font-size:1.2rem;">💳</span>
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

  // --- TAB 5: TRAIL CLUB & REWARDS ---
  renderRewardsTab() {
    const user = this.currentUser || { trailPoints: 1450 };
    const vouchers = this.dataManager.getVouchers();
    const container = document.getElementById("customerVouchersGrid");
    const pointsDisplay = document.getElementById("rewardsPointsBalance");

    if (pointsDisplay) pointsDisplay.textContent = `${user.trailPoints || 1450} Points`;

    if (container) {
      container.innerHTML = vouchers.map(v => `
        <div class="voucher-card ${v.redeemed ? 'redeemed' : ''}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="card-label-badge">${v.pointsRequired} Trail Points</span>
              ${v.redeemed ? `<span class="status-pill delivered">Redeemed</span>` : `<span class="status-pill processing">Available</span>`}
            </div>
            <strong style="font-size:1.05rem; display:block; color:var(--color-text-dark);">${v.title}</strong>
            <p style="font-size:0.8rem; color:var(--color-text-muted); margin-top:4px;">Min. spend: $${v.minSpend.toFixed(2)} &bull; Valid thru ${v.expiryDate}</p>
          </div>

          <div>
            ${v.redeemed ? `
              <div style="display:flex; align-items:center; justify-content:space-between; background:#f0fdf4; padding:8px 12px; border-radius:6px; border:1px solid #bbf7d0;">
                <span class="voucher-code-badge">${v.code}</span>
                <button class="dash-btn dash-btn-outline dash-btn-sm" onclick="navigator.clipboard.writeText('${v.code}'); showDashToast('Coupon code copied to clipboard!', 'success');">Copy</button>
              </div>
            ` : `
              <button class="dash-btn dash-btn-primary" style="width:100%; justify-content:center;" onclick="window.location.href='./404.html'">)">
                Redeem for ${v.pointsRequired} Pts
              </button>
            `}
          </div>
        </div>
      `).join("");
    }
  }

  claimVoucher(voucherId) {
    const user = this.currentUser || { id: "usr-cust-01", trailPoints: 1450 };
    const res = this.dataManager.redeemVoucher(voucherId, user);

    if (res.success) {
      showDashToast(`Voucher unlocked! Promo code: ${res.voucher.code}`, "success");
      this.renderRewardsTab();
      this.renderOverviewTab();
    } else {
      showDashToast(res.message, "error");
    }
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
