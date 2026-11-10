/**
 * STACKLY OUTDOOR - Main Interactive Application Script
 * Sticky header, Mobile Nav, Modals, Wishlist, Tabs, and Scroll Animations
 */

const WISHLIST_STORAGE_KEY = "stackly_wishlist_items_v1";

class MainApp {
  constructor() {
    this.wishlist = this.loadWishlist();
    this.initHeader();
    this.initMobileNav();
    this.initScrollReveal();
    this.initBackToTop();
    this.initWishlist();
    this.initQuickView();
    this.initAdventureModals();
    this.initHomepageTabs();
  }

  // --- 1. HEADER & STICKY NAV ---
  initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // --- 2. MOBILE NAVIGATION ---
  initMobileNav() {
    const burgerBtn = document.getElementById("mobileMenuBtn");
    const navDrawer = document.getElementById("mobileNavDrawer");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("closeMobileNavBtn");

    if (!burgerBtn || !navDrawer || !overlay) return;

    const openMenu = () => {
      burgerBtn.classList.add("active");
      navDrawer.classList.add("active");
      overlay.classList.add("active");
      document.body.classList.add("no-scroll");
    };

    const closeMenu = () => {
      burgerBtn.classList.remove("active");
      navDrawer.classList.remove("active");
      overlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    };

    burgerBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    // Close when clicking mobile links
    navDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }

  // --- 3. WISHLIST MANAGEMENT ---
  loadWishlist() {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
      this.updateWishlistUI();
    } catch (e) {}
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const prod = typeof getProductById === "function" ? getProductById(productId) : null;
    const name = prod ? prod.name : "Item";

    if (index > -1) {
      this.wishlist.splice(index, 1);
      if (window.stacklyCart) {
        window.stacklyCart.showToast(`Removed "${name}" from your wishlist.`, "info");
      }
    } else {
      this.wishlist.push(productId);
      if (window.stacklyCart) {
        window.stacklyCart.showToast(`Saved "${name}" to your wishlist!`, "success");
      }
    }

    this.saveWishlist();
  }

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  }

  updateWishlistUI() {
    const count = this.wishlist.length;
    document.querySelectorAll(".wishlist-count-badge").forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });

    document.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
      const id = btn.getAttribute("data-id");
      if (this.isWishlisted(id)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Remove from wishlist");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Add to wishlist");
      }
    });
  }

  initWishlist() {
    this.updateWishlistUI();
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".wishlist-toggle-btn");
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        if (id) {
          this.toggleWishlist(id);
        }
      }
    });
  }

  // --- 4. QUICK VIEW MODAL ---
  initQuickView() {
    let modal = document.getElementById("quickViewModal");
    if (!modal) {
      const modalHtml = `
        <div id="quickViewModal" class="modal-container">
          <div class="modal-overlay" id="quickViewOverlay"></div>
          <div class="modal-dialog quick-view-dialog">
            <button class="modal-close-btn" id="closeQuickViewBtn" aria-label="Close modal">&times;</button>
            <div class="quick-view-content" id="quickViewContent"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      modal = document.getElementById("quickViewModal");
    }

    const overlay = document.getElementById("quickViewOverlay");
    const closeBtn = document.getElementById("closeQuickViewBtn");

    const closeModal = () => {
      modal.classList.remove("active");
      document.body.classList.remove("no-scroll");
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", closeModal);

    document.addEventListener("click", (e) => {
      const qvBtn = e.target.closest(".quick-view-trigger");
      if (qvBtn) {
        e.preventDefault();
        const prodId = qvBtn.getAttribute("data-id");
        this.openQuickView(prodId);
      }
    });
  }

  openQuickView(productId) {
    const prod = typeof getProductById === "function" ? getProductById(productId) : null;
    if (!prod) return;

    const modal = document.getElementById("quickViewModal");
    const content = document.getElementById("quickViewContent");
    if (!modal || !content) return;

    const isFav = this.isWishlisted(prod.id);

    content.innerHTML = `
      <div class="qv-grid">
        <div class="qv-gallery">
          <div class="qv-main-img-box">
            <img src="${prod.image}" alt="${prod.name}" id="qvMainImage" class="qv-main-img" />
            <span class="qv-badge">${prod.badge}</span>
          </div>
          ${prod.gallery && prod.gallery.length > 1 ? `
            <div class="qv-thumbs">
              ${prod.gallery.map((thumb, idx) => `
                <button type="button" class="qv-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('qvMainImage').src='${thumb}'; document.querySelectorAll('.qv-thumb-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active');">
                  <img src="${thumb}" alt="thumbnail" />
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>
        <div class="qv-details">
          <div class="qv-category-label">${prod.categoryLabel}</div>
          <h2 class="qv-title">${prod.name}</h2>
          
          <div class="qv-rating-row">
            <span class="stars-val"><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span></span>
            <span class="score-text"><strong>${prod.rating}</strong> / 5.0</span>
            <span class="count-text">(${prod.reviewCount} backcountry reviews)</span>
          </div>

          <div class="qv-price-row">
            <span class="qv-price">$${prod.price.toFixed(2)}</span>
            ${prod.originalPrice ? `<span class="qv-orig-price">$${prod.originalPrice.toFixed(2)}</span>` : ""}
            <span class="stock-status in-stock">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>
              In Stock (${prod.stockCount} ready to ship)
            </span>
          </div>

          <p class="qv-desc">${prod.description}</p>

          <div class="qv-specs-mini">
            <h4>Highlights</h4>
            <ul>
              ${Object.entries(prod.specs || {}).slice(0, 3).map(([key, val]) => `
                <li><strong>${key}:</strong> ${val}</li>
              `).join("")}
            </ul>
          </div>

          <div class="qv-actions">
            <div class="qty-stepper qv-qty-stepper">
              <button type="button" class="qty-btn" onclick="const val=document.getElementById('qvQtyInput'); val.value = Math.max(1, parseInt(val.value)-1);">−</button>
              <input type="number" id="qvQtyInput" value="1" min="1" max="${prod.stockCount}" readonly />
              <button type="button" class="qty-btn" onclick="const val=document.getElementById('qvQtyInput'); val.value = Math.min(${prod.stockCount}, parseInt(val.value)+1);">+</button>
            </div>
            <button type="button" class="btn btn-primary btn-add-qv" onclick="const q=parseInt(document.getElementById('qvQtyInput').value); window.stacklyCart.addItem('${prod.id}', q); document.getElementById('quickViewModal').classList.remove('active'); document.body.classList.remove('no-scroll');">
              Add to Pack ($${prod.price.toFixed(2)})
            </button>
            
          </div>

          <div class="qv-view-full-wrap">
            <a href="product-details.html?id=${prod.id}" class="qv-full-link">
              View Complete Specs & Customer Field Reviews <span class="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  }

  // --- 5. ADVENTURE TRAIL GUIDE MODALS (Section 1) ---
  initAdventureModals() {
    const adventureGuides = {
      "alpine": {
        title: "Alpine Glaciers & High Summits",
        elevation: "3,850m / 12,630 ft",
        difficulty: "Advanced Mountaineering",
        duration: "4 - 6 Days",
        desc: "Traverse high altitude ridges and pristine glacial valleys. Technical crampons, a 4-season geodesic shelter, and high-altitude down insulation are mandatory for safe travel.",
        gear: ["Summit Ridge 2P Ultralight Tent", "Sub-Zero 850-Fill Down Sleeping Bag", "Carbon Glide Pro Trekking Poles"],
        tip: "Set camp below the saddle line to stay shielded from night katabatic winds."
      },
      "forest": {
        title: "Pacific Northwest Redwood Forests",
        elevation: "650m / 2,130 ft",
        difficulty: "Moderate Backpacking",
        duration: "3 Days",
        desc: "Hike beneath millennia-old giants amidst coastal mist and emerald moss. Constant humidity requires seam-sealed waterproof shells and synthetic or hydrophobic-treated down gear.",
        gear: ["Granite Peak Waterproof Hiking Boots", "Expedition Pro 65L Hiking Backpack", "Beacon 500 Lumen Solar Camping Lantern"],
        tip: "Hang food sacks at least 12 feet high on bear cables; black bears are active along the riverbeds."
      },
      "canyon": {
        title: "Red Rock Desert Canyons",
        elevation: "1,420m / 4,650 ft",
        difficulty: "Strenuous Sun & Sand Trek",
        duration: "3 - 5 Days",
        desc: "Navigate narrow sandstone slot canyons and slickrock plateaus where water sources are rare. Hydration capacity and sun protection take top priority.",
        gear: ["TrailTough 32oz Insulated Thermal Flask", "Wildwood Camp Hatchet & Multi-Tool", "Solaris 24W Foldable Solar Trail Panel"],
        tip: "Carry minimum 4 liters of water per day and never enter slot canyons if rain is forecasted in the basin."
      },
      "fjord": {
        title: "Nordic Fjords & Waterfall Routes",
        elevation: "1,100m / 3,600 ft",
        difficulty: "All-Terrain Coastal Traverse",
        duration: "2 - 4 Days",
        desc: "Climb dramatic cliffs rising steeply from deep ocean waters. Sudden squalls demand rugged windproof gear, wool base layers, and reliable navigation aids.",
        gear: ["Navigator Heritage Brass Sighting Compass", "Vortex Titanium Micro Camp Stove", "CloudRest Ultralight Camp Hammock"],
        tip: "Wild camping is permitted under Right to Roam laws; maintain 150m distance from nearest dwellings."
      }
    };

    document.querySelectorAll(".adv-guide-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const advKey = btn.getAttribute("data-adv");
        const guide = adventureGuides[advKey];
        if (!guide) return;

        let modal = document.getElementById("advGuideModal");
        if (!modal) {
          modal = document.createElement("div");
          modal.id = "advGuideModal";
          modal.className = "modal-container";
          document.body.appendChild(modal);
        }

        modal.innerHTML = `
          <div class="modal-overlay" id="advOverlay"></div>
          <div class="modal-dialog adv-dialog">
            <button class="modal-close-btn" id="closeAdvBtn" aria-label="Close guide">&times;</button>
            <div class="adv-modal-header">
              <span class="adv-badge">Trail Expedition Brief</span>
              <h3>${guide.title}</h3>
              <div class="adv-meta-pills">
                <span><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">landscape</span> <strong>Elevation:</strong> ${guide.elevation}</span>
                <span><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">hiking</span> <strong>Difficulty:</strong> ${guide.difficulty}</span>
                <span><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">timer</span> <strong>Duration:</strong> ${guide.duration}</span>
              </div>
            </div>
            <div class="adv-modal-body">
              <p class="adv-desc-lead">${guide.desc}</p>
              
              <div class="adv-tip-box">
                <strong><span class="material-symbols-outlined" style="font-size:1.1rem; vertical-align:middle; color:var(--color-gold); margin-right:4px;">tips_and_updates</span> Backcountry Ranger Tip:</strong>
                <p>${guide.tip}</p>
              </div>

              <h4>Recommended Gear Checklist for this Route:</h4>
              <ul class="adv-gear-list">
                ${guide.gear.map(item => `
                  <li>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c8963e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${item}</span>
                  </li>
                `).join("")}
              </ul>

              <div class="adv-cta-actions">
                <a href="./404.html" class="btn btn-primary">Equip This Trip in Shop</a>
                <button type="button" class="btn btn-outline" id="advDismissBtn">Close Brief</button>
              </div>
            </div>
          </div>
        `;

        modal.classList.add("active");
        document.body.classList.add("no-scroll");

        const closeGuide = () => {
          modal.classList.remove("active");
          document.body.classList.remove("no-scroll");
        };

        const closeBtn = document.getElementById("closeAdvBtn");
        const dismissBtn = document.getElementById("advDismissBtn");
        const overlay = document.getElementById("advOverlay");

        if (closeBtn) closeBtn.addEventListener("click", closeGuide);
        if (dismissBtn) dismissBtn.addEventListener("click", closeGuide);
        if (overlay) overlay.addEventListener("click", closeGuide);
      });
    });
  }

  // --- 6. HOMEPAGE PRODUCT CATEGORY TABS (Section 2) ---
  initHomepageTabs() {
    const tabButtons = document.querySelectorAll(".category-tab-btn");
    const grid = document.getElementById("bestsellersGrid");
    if (!grid || tabButtons.length === 0) return;

    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const cat = btn.getAttribute("data-cat");
        this.renderBestsellers(cat);
      });
    });

    // Render initial
    this.renderBestsellers("all");
  }

  renderBestsellers(category) {
    const grid = document.getElementById("bestsellersGrid");
    if (!grid) return;

    let products = typeof getAllProducts === "function" ? getAllProducts() : [];
    if (category && category !== "all") {
      products = products.filter(p => p.category === category);
    }
    // Limit to 8 items on home
    const displayItems = products.slice(0, 8);

    grid.innerHTML = displayItems.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-card-top">
          <span class="product-badge">${p.badge}</span>
          <button type="button" class="wishlist-toggle-btn ${this.isWishlisted(p.id) ? 'active' : ''}" data-id="${p.id}" aria-label="Toggle wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <a href="product-details.html?id=${p.id}" class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" class="product-thumb" loading="lazy" />
          </a>
          <div class="product-quick-actions">
            <button type="button" class="btn-quick-view quick-view-trigger" data-id="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Quick View
            </button>
          </div>
        </div>
        <div class="product-card-info">
          <span class="product-cat-name">${p.categoryLabel}</span>
          <h3 class="product-title">
            <a href="product-details.html?id=${p.id}">${p.name}</a>
          </h3>
          <div class="product-rating-line">
            <span class="stars"><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span><span class="material-symbols-outlined star-icon">star</span></span>
            <span class="score">${p.rating}</span>
            <span class="count">(${p.reviewCount})</span>
          </div>
          <div class="product-price-row">
            <div class="product-prices">
              <span class="curr-price">$${p.price.toFixed(2)}</span>
              ${p.originalPrice ? `<span class="prev-price">$${p.originalPrice.toFixed(2)}</span>` : ""}
            </div>
            <button type="button" class="btn btn-primary btn-sm btn-card-add" onclick="window.stacklyCart.addItem('${p.id}', 1)" aria-label="Add ${p.name} to cart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Add
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  // --- 7. SCROLL REVEAL ANIMATIONS ---
  initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal-fade, .reveal-up, .reveal-stagger").forEach(el => {
      observer.observe(el);
    });
  }

  // --- 8. BACK TO TOP ---
  initBackToTop() {
    let topBtn = document.getElementById("backToTopBtn");
    if (!topBtn) {
      topBtn = document.createElement("button");
      topBtn.id = "backToTopBtn";
      topBtn.className = "back-to-top-btn";
      topBtn.setAttribute("aria-label", "Back to top of page");
      topBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
      document.body.appendChild(topBtn);
    }

    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        topBtn.classList.add("visible");
      } else {
        topBtn.classList.remove("visible");
      }
    }, { passive: true });

    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.stacklyApp = new MainApp();
});
