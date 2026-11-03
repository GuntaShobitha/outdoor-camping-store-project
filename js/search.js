/**
 * STACKLY OUTDOOR - Live Search Engine & Search Modal
 */

class SearchManager {
  constructor() {
    this.modal = null;
    this.overlay = null;
    this.input = null;
    this.resultsList = null;
    this.initUI();
  }

  initUI() {
    // Inject search modal if not present in DOM
    if (!document.getElementById("searchModal")) {
      const searchModalHtml = `
        <div id="searchModal" class="search-modal-container">
          <div class="search-modal-overlay" id="searchModalOverlay"></div>
          <div class="search-modal-dialog">
            <div class="search-modal-header">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="liveSearchInput" placeholder="Search outdoor gear, tents, sleeping bags, packs..." autocomplete="off" />
                <button type="button" class="search-clear-btn" id="searchClearBtn" aria-label="Clear query">&times;</button>
              </div>
              <button type="button" class="search-modal-close" id="searchModalClose" aria-label="Close search">ESC</button>
            </div>
            
            <div class="search-modal-body">
              <div class="search-popular-tags" id="searchPopularTags">
                <span class="popular-label">Popular Searches:</span>
                <button type="button" class="tag-pill" data-search="Tent">Tents</button>
                <button type="button" class="tag-pill" data-search="Backpack">Backpacks</button>
                <button type="button" class="tag-pill" data-search="Sleeping">Sleeping Bags</button>
                <button type="button" class="tag-pill" data-search="Stove">Camp Stoves</button>
                <button type="button" class="tag-pill" data-search="Boots">Boots</button>
                <button type="button" class="tag-pill" data-search="Lantern">Lanterns</button>
              </div>

              <div class="search-results-area" id="searchResultsArea">
                <div class="search-initial-hint">
                  <p>Type keywords to discover field-tested camping & trail equipment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", searchModalHtml);
    }

    this.modal = document.getElementById("searchModal");
    this.overlay = document.getElementById("searchModalOverlay");
    this.input = document.getElementById("liveSearchInput");
    this.resultsList = document.getElementById("searchResultsArea");
    this.clearBtn = document.getElementById("searchClearBtn");

    this.attachEventListeners();
  }

  openModal() {
    if (!this.modal) return;
    this.modal.classList.add("active");
    document.body.classList.add("no-scroll");
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 150);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
    if (this.input) this.input.value = "";
    if (this.clearBtn) this.clearBtn.style.display = "none";
    if (this.resultsList) {
      this.resultsList.innerHTML = `
        <div class="search-initial-hint">
          <p>Type keywords to discover field-tested camping & trail equipment.</p>
        </div>
      `;
    }
  }

  executeSearch(query) {
    if (!this.resultsList) return;
    const q = query.trim();

    if (!q) {
      if (this.clearBtn) this.clearBtn.style.display = "none";
      this.resultsList.innerHTML = `
        <div class="search-initial-hint">
          <p>Type keywords to discover field-tested camping & trail equipment.</p>
        </div>
      `;
      return;
    }

    if (this.clearBtn) this.clearBtn.style.display = "block";

    const results = typeof searchProducts === "function" ? searchProducts(q) : [];

    if (results.length === 0) {
      this.resultsList.innerHTML = `
        <div class="search-no-results">
          <div class="no-results-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          </div>
          <h4>No trail gear found matching "${escapeHtml(q)}"</h4>
          <p>Try checking your spelling, using broader terms, or explore our essential collections below.</p>
          <div class="suggested-pills">
            <a href="shop.html?category=tents" class="btn btn-outline btn-sm">Explore Tents</a>
            <a href="shop.html?category=packs" class="btn btn-outline btn-sm">Explore Packs</a>
            <a href="shop.html?category=cooking" class="btn btn-outline btn-sm">Camp Kitchen</a>
          </div>
        </div>
      `;
      return;
    }

    this.resultsList.innerHTML = `
      <div class="search-results-meta">
        <span>Found <strong>${results.length}</strong> matching products for "<strong>${escapeHtml(q)}</strong>"</span>
      </div>
      <div class="search-results-grid">
        ${results.map(prod => `
          <div class="search-result-card">
            <a href="product-details.html?id=${prod.id}" class="search-res-img-link">
              <img src="${prod.image}" alt="${prod.name}" class="search-res-img" />
            </a>
            <div class="search-res-info">
              <span class="search-res-cat">${prod.categoryLabel}</span>
              <h4 class="search-res-title">
                <a href="product-details.html?id=${prod.id}">${this.highlightText(prod.name, q)}</a>
              </h4>
              <div class="search-res-price">
                <strong>$${prod.price.toFixed(2)}</strong>
                ${prod.originalPrice ? `<span class="orig-price">$${prod.originalPrice.toFixed(2)}</span>` : ""}
              </div>
            </div>
            <div class="search-res-actions">
              <button type="button" class="btn btn-primary btn-sm" onclick="window.stacklyCart.addItem('${prod.id}', 1); window.stacklySearch.closeModal();">
                Add to Cart
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  }

  attachEventListeners() {
    // Open trigger buttons (header search icon, mobile search icon)
    document.querySelectorAll(".search-trigger-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Close buttons
    const closeBtn = document.getElementById("searchModalClose");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
    if (this.overlay) this.overlay.addEventListener("click", () => this.closeModal());

    // Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });

    // Input typing with debounce
    let timeout = null;
    if (this.input) {
      this.input.addEventListener("input", (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.executeSearch(e.target.value);
        }, 180);
      });
    }

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        if (this.input) {
          this.input.value = "";
          this.input.focus();
        }
        this.executeSearch("");
      });
    }

    // Popular tag pills
    document.querySelectorAll(".search-popular-tags .tag-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const query = pill.getAttribute("data-search");
        if (this.input) {
          this.input.value = query;
        }
        this.executeSearch(query);
      });
    });
  }
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.stacklySearch = new SearchManager();
});
