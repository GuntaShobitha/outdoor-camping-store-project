/**
 * STACKLY OUTDOOR - Shopping Cart Engine
 * Handles cart state, localStorage persistence, cart page rendering, and checkout simulation
 */

const CART_STORAGE_KEY = "stackly_cart_items_v1";
const COUPON_STORAGE_KEY = "stackly_applied_coupon_v1";
const FREE_SHIPPING_THRESHOLD = 75.00;

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.coupon = this.loadCoupon();
    this.initUI();
  }

  loadCart() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.updateBadges();
      this.renderCartPage();
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }

  loadCoupon() {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  saveCoupon(code) {
    this.coupon = code;
    try {
      if (code) {
        localStorage.setItem(COUPON_STORAGE_KEY, code);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {}
    this.renderCartPage();
  }

  addItem(productId, quantity = 1, options = {}) {
    const product = typeof getProductById === "function" ? getProductById(productId) : null;
    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    const existingIndex = this.items.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.categoryLabel,
        quantity: quantity,
        options: options
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.name}" to your cart!`, "success");
    window.location.href = "cart.html";
  }

  removeItem(productId) {
    const item = this.items.find(i => i.id === productId);
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    if (item) {
      this.showToast(`Removed "${item.name}" from your cart.`, "info");
    }
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.saveCart();
    }
  }

  setQuantity(productId, qty) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;
    const parsed = parseInt(qty, 10);
    if (isNaN(parsed) || parsed <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = parsed;
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCoupon("");
    this.saveCart();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDiscount() {
    if (this.coupon && this.coupon.toUpperCase() === "ADVENTURE10") {
      return this.getSubtotal() * 0.10;
    }
    return 0;
  }

  getShipping() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.95;
  }

  getTotal() {
    return Math.max(0, this.getSubtotal() - this.getDiscount() + this.getShipping());
  }

  renderCartPage() {
    const cartPage = document.getElementById("cartPage");
    if (!cartPage) return;

    const itemsBody = document.getElementById("cartItemsBody");
    const emptyState = document.getElementById("cartEmptyState");
    const warningBox = document.getElementById("cartWarningBox");
    const warningText = document.getElementById("cartWarningText");
    const cartCount = document.getElementById("cartCount");
    const cartSubtotalEl = document.getElementById("cartSubtotal");
    const cartDiscountRow = document.getElementById("cartDiscountRow");
    const cartDiscountEl = document.getElementById("cartDiscount");
    const cartShippingEl = document.getElementById("cartShipping");
    const cartTotalEl = document.getElementById("cartTotal");
    const freeShippingProgress = document.getElementById("freeShippingProgress");
    const freeShippingText = document.getElementById("freeShippingText");

    if (emptyState) {
      if (!this.items.length) {
        emptyState.style.display = "block";
        if (warningBox) warningBox.style.display = "none";
        if (cartCount) cartCount.style.display = "none";
        if (itemsBody) itemsBody.innerHTML = "";
      } else {
        emptyState.style.display = "none";
      }
    }

    if (warningBox && warningText && !this._lastWarning) {
      warningBox.style.display = "none";
    }

    if (cartCount) {
      cartCount.textContent = this.getTotalCount();
      cartCount.style.display = this.getTotalCount() > 0 ? "inline-flex" : "none";
    }

    const FREE_SHIPPING_THRESHOLD = 75.00;
    const subtotal = this.getSubtotal();
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    if (freeShippingProgress) freeShippingProgress.style.width = `${progress}%`;
    if (freeShippingText) {
      if (remaining <= 0) {
        freeShippingText.innerHTML = `<span style="color:var(--color-primary-green);font-weight:700;">FREE Backcountry Shipping unlocked</span>`;
      } else {
        freeShippingText.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for <strong>FREE Shipping</strong>`;
      }
    }

    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    const discount = this.getDiscount();
    if (cartDiscountRow && cartDiscountEl) {
      if (discount > 0) {
        cartDiscountRow.style.display = "flex";
        cartDiscountEl.textContent = `-$${discount.toFixed(2)}`;
      } else {
        cartDiscountRow.style.display = "none";
      }
    }

    const shipping = this.getShipping();
    if (cartShippingEl) cartShippingEl.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${this.getTotal().toFixed(2)}`;
  }

  initUI() {
    this.updateBadges();
    this.attachEventListeners();
  }

  updateBadges() {
    const count = this.getTotalCount();
    const badgeElements = document.querySelectorAll(".cart-count-badge");
    badgeElements.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  }



  applyCouponCode(code) {
    if (!code) return;
    const clean = code.trim().toUpperCase();
    if (clean === "ADVENTURE10") {
      this.saveCoupon(clean);
      this.showToast("Promo code ADVENTURE10 applied! 10% discount added.", "success");
    } else {
      this.showToast(`Coupon code "${code}" is invalid or expired. Try "ADVENTURE10"`, "error");
    }
  }

  showToast(message, type = "info") {
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

  attachEventListeners() {
    // Cart trigger always goes to the cart page. On cart.html itself, stay on the page and scroll to cart.
    document.querySelectorAll(".cart-trigger-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cartPage = document.getElementById("cartPage");
        if (cartPage) {
          // Already on cart.html: ensure cart is visible.
          cartPage.scrollIntoView({ behavior: "smooth", block: "start" });
          if (typeof window.stacklyCart.renderCartPage === "function") {
            try { window.stacklyCart.renderCartPage(); } catch {}
          }
          if (typeof window.stacklyCart.updateBadges === "function") {
            try { window.stacklyCart.updateBadges(); } catch {}
          }
          return;
        }

        window.location.href = "cart.html";
      });
    });



    // Coupon form
    const couponBtn = document.getElementById("applyCouponBtn");
    const couponInput = document.getElementById("cartCouponInput");
    if (couponBtn && couponInput) {
      couponBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.applyCouponCode(couponInput.value);
        couponInput.value = "";
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openCheckoutModal();
      });
    }
  }

  openCheckoutModal() {
    if (this.items.length === 0) {
      this.showToast("Your cart is empty!", "info");
      return;
    }
    // No longer uses a drawer; cart lives on cart.html.

    let modal = document.getElementById("checkoutModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "checkoutModal";
      modal.className = "modal-container";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-overlay" id="checkoutOverlay"></div>
      <div class="modal-dialog checkout-dialog">
        <button class="modal-close-btn" id="closeCheckoutBtn" aria-label="Close checkout">&times;</button>
        <div class="checkout-header">
          <div class="checkout-logo">[STACKLY]</div>
          <h3>Secure Backcountry Checkout</h3>
          <p>Complete your order simulation below</p>
        </div>
        <div class="checkout-body">
          <div class="checkout-summary-box">
            <h4>Order Summary (${this.getTotalCount()} items)</h4>
            <div class="checkout-items-preview">
              ${this.items.map(i => `
                <div class="checkout-item-line">
                  <span>${i.name} × ${i.quantity}</span>
                  <strong>$${(i.price * i.quantity).toFixed(2)}</strong>
                </div>
              `).join("")}
            </div>
            <div class="checkout-totals">
              <div class="total-row"><span>Subtotal:</span><span>$${this.getSubtotal().toFixed(2)}</span></div>
              ${this.getDiscount() > 0 ? `<div class="total-row discount"><span>Discount:</span><span>-$${this.getDiscount().toFixed(2)}</span></div>` : ""}
              <div class="total-row"><span>Shipping:</span><span>${this.getShipping() === 0 ? "FREE" : "$" + this.getShipping().toFixed(2)}</span></div>
              <div class="total-row final"><span>Total:</span><strong>$${this.getTotal().toFixed(2)}</strong></div>
            </div>
          </div>
          <form id="checkoutForm" class="checkout-form">
            <h4>1. Shipping Destination</h4>
            <div class="form-row">
              <div class="form-group half">
                <label>First Name *</label>
                <input type="text" id="chkFirstName" required placeholder="Alex" />
                <span class="field-error" id="errChkFirst"></span>
              </div>
              <div class="form-group half">
                <label>Last Name *</label>
                <input type="text" id="chkLastName" required placeholder="Rivers" />
                <span class="field-error" id="errChkLast"></span>
              </div>
            </div>
            <div class="form-group">
              <label>Email Address (For tracking & receipts) *</label>
              <input type="email" id="chkEmail" required placeholder="alex.rivers@trailmail.com" />
              <span class="field-error" id="errChkEmail"></span>
            </div>
            <div class="form-group">
              <label>Street Address *</label>
              <input type="text" id="chkAddress" required placeholder="1420 Pine Needle Way" />
              <span class="field-error" id="errChkAddress"></span>
            </div>
            <div class="form-row">
              <div class="form-group third">
                <label>City *</label>
                <input type="text" id="chkCity" required placeholder="Boulder" />
              </div>
              <div class="form-group third">
                <label>State / Region *</label>
                <input type="text" id="chkState" required placeholder="Colorado" />
              </div>
              <div class="form-group third">
                <label>ZIP / Postal *</label>
                <input type="text" id="chkZip" required placeholder="80301" />
              </div>
            </div>
            <h4>2. Payment Simulation</h4>
            <div class="simulation-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>This is a realistic frontend simulation. No actual payment credentials will be billed.</span>
            </div>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" value="•••• •••• •••• 4242" disabled class="disabled-card-input" />
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-place-order" id="submitOrderBtn">
              Confirm & Place Simulated Order ($${this.getTotal().toFixed(2)})
            </button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");

    // Modal listeners
    const closeBtn = document.getElementById("closeCheckoutBtn");
    const overlay = document.getElementById("checkoutOverlay");
    const closeModal = () => {
      modal.classList.remove("active");
      document.body.classList.remove("no-scroll");
    };
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    // Form submission
    const form = document.getElementById("checkoutForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fName = document.getElementById("chkFirstName").value.trim();
        const email = document.getElementById("chkEmail").value.trim();
        const addr = document.getElementById("chkAddress").value.trim();

        if (!fName || !email || !addr) {
          alert("Please fill in all required shipping fields.");
          return;
        }

        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert("Please provide a valid email address for your order confirmation.");
          return;
        }

        // Success simulation
        const orderId = "STK-" + Math.floor(100000 + Math.random() * 900000);

        // Save order to store database so it appears in Admin & Customer dashboards
        if (window.stacklyData && typeof window.stacklyData.createOrder === "function") {
          const lName = document.getElementById("chkLastName") ? document.getElementById("chkLastName").value.trim() : "";
          const city = document.getElementById("chkCity") ? document.getElementById("chkCity").value.trim() : "Boulder";
          const state = document.getElementById("chkState") ? document.getElementById("chkState").value.trim() : "CO";
          const zip = document.getElementById("chkZip") ? document.getElementById("chkZip").value.trim() : "80301";

          window.stacklyData.createOrder({
            id: orderId,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            customer: {
              id: "usr-" + Date.now(),
              name: `${fName} ${lName}`.trim(),
              email: email,
              shippingAddress: `${addr}, ${city}, ${state} ${zip}`
            },
            items: [...this.items],
            subtotal: this.getSubtotal(),
            shippingFee: this.getShipping(),
            discount: this.getDiscount(),
            tax: parseFloat((this.getSubtotal() * 0.0825).toFixed(2)),
            total: this.getTotal(),
            paymentStatus: "Paid",
            fulfillmentStatus: "Processing",
            courier: "FedEx Trail Express",
            trackingNumber: "FDX-" + Math.floor(10000000 + Math.random() * 90000000) + "US",
            estimatedDelivery: "Arriving in 3-5 days"
          });
        }
        modal.querySelector(".checkout-body").innerHTML = `
          <div class="order-success-view">
            <div class="success-icon-badge">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3>Gear Is Heading Your Way!</h3>
            <p class="order-num">Order Confirmation: <strong>#${orderId}</strong></p>
            <p class="order-msg">Thank you, <strong>${fName}</strong>. A receipt and carbon-neutral tracking link have been dispatched to <strong>${email}</strong>.</p>
            <div class="order-next-steps">
              <p>🌱 Packed in 100% biodegradable trail packaging.</p>
              <p>🛡️ Covered by the Stackly Lifetime Trail Warranty.</p>
            </div>
            <button class="btn btn-primary" onclick="document.getElementById('checkoutModal').classList.remove('active'); document.body.classList.remove('no-scroll'); window.stacklyCart.clearCart();">Return to Store</button>
          </div>
        `;
      });
    }
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.stacklyCart = new CartManager();
});
