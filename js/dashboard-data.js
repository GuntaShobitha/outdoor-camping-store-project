/**
 * STACKLY OUTDOOR & CAMPING - Master Data & Dashboard Engine
 * Synchronizes products, orders, customers, saved addresses, payment methods,
 * loyalty rewards, and store settings across Admin and Customer dashboards with
 * full localStorage persistence.
 */

const DASHBOARD_ORDERS_KEY = "stackly_orders_db_v1";
const DASHBOARD_PRODUCTS_KEY = "stackly_products_db_v1";
const DASHBOARD_ADDRESSES_KEY = "stackly_addresses_db_v1";
const DASHBOARD_PAYMENTS_KEY = "stackly_payments_db_v1";
const DASHBOARD_SETTINGS_KEY = "stackly_settings_db_v1";
const DASHBOARD_VOUCHERS_KEY = "stackly_vouchers_db_v1";

// Initial Seed Orders
const DEFAULT_ORDERS = [
  {
    id: "STK-91823",
    date: "Oct 28, 2026",
    customer: {
      id: "usr-cust-01",
      name: "Alex Rivers",
      email: "alex@backcountry.com",
      phone: "+1 (303) 847-2910",
      shippingAddress: "1420 Pine Needle Way, Boulder, CO 80301"
    },
    items: [
      { id: "prod-1", name: "Summit Ridge 2P Ultralight Tent", price: 349.00, quantity: 1, image: "assets/images/products/prod-tent.webp" },
      { id: "prod-5", name: "Titanium Ultralight Camp Stove", price: 79.00, quantity: 1, image: "assets/images/products/prod-stove.webp" }
    ],
    subtotal: 428.00,
    shippingFee: 0.00,
    discount: 0.00,
    tax: 35.31,
    total: 463.31,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
    courier: "FedEx Trail Express",
    trackingNumber: "FDX-99281742US",
    estimatedDelivery: "Nov 04, 2026",
    notes: "Leave by back porch gear rack if not home."
  },
  {
    id: "STK-88210",
    date: "Oct 20, 2026",
    customer: {
      id: "usr-cust-02",
      name: "Sarah Jenkins",
      email: "sarah.trail@summit.com",
      phone: "+1 (206) 555-4819",
      shippingAddress: "742 Alpine Crest Blvd, Seattle, WA 98101"
    },
    items: [
      { id: "prod-2", name: "Sub-Zero 850-Fill Down Sleeping Bag", price: 289.00, quantity: 1, image: "assets/images/products/prod-sleeping-bag.webp" },
      { id: "prod-8", name: "Trailblazer Tactical Compass", price: 34.00, quantity: 1, image: "assets/images/products/prod-compass.webp" }
    ],
    subtotal: 323.00,
    shippingFee: 0.00,
    discount: 32.30,
    tax: 26.65,
    total: 317.35,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    courier: "USPS Priority Backcountry",
    trackingNumber: "940011189922331002",
    estimatedDelivery: "Delivered on Oct 24",
    notes: "Signature required."
  },
  {
    id: "STK-77402",
    date: "Nov 01, 2026",
    customer: {
      id: "usr-cust-03",
      name: "David Miller",
      email: "david.climber@rockies.org",
      phone: "+1 (720) 412-9901",
      shippingAddress: "310 Canyon Rim Rd, Denver, CO 80202"
    },
    items: [
      { id: "prod-4", name: "Carbon Fiber Anti-Shock Trekking Poles", price: 94.00, quantity: 1, image: "assets/images/products/prod-poles.webp" },
      { id: "prod-7", name: "Backcountry Thermal Flask (1L)", price: 42.00, quantity: 1, image: "assets/images/products/prod-flask.webp" }
    ],
    subtotal: 136.00,
    shippingFee: 0.00,
    discount: 0.00,
    tax: 11.22,
    total: 147.22,
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    courier: "UPS Ground",
    trackingNumber: "UPS-1Z9999999999999",
    estimatedDelivery: "Nov 06, 2026",
    notes: "Expedited processing."
  },
  {
    id: "STK-66190",
    date: "Sep 15, 2026",
    customer: {
      id: "usr-cust-01",
      name: "Alex Rivers",
      email: "alex@backcountry.com",
      phone: "+1 (303) 847-2910",
      shippingAddress: "1420 Pine Needle Way, Boulder, CO 80301"
    },
    items: [
      { id: "prod-3", name: "Granite 65L Expedition Pack", price: 265.00, quantity: 1, image: "assets/images/products/prod-backpack.webp" }
    ],
    subtotal: 265.00,
    shippingFee: 0.00,
    discount: 26.50,
    tax: 21.86,
    total: 260.36,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    courier: "FedEx Trail Express",
    trackingNumber: "FDX-77182901US",
    estimatedDelivery: "Delivered on Sep 19",
    notes: ""
  },
  {
    id: "STK-55341",
    date: "Aug 12, 2026",
    customer: {
      id: "usr-cust-04",
      name: "Maya Lin",
      email: "maya.adventures@utah.net",
      phone: "+1 (801) 321-7788",
      shippingAddress: "88 Wasatch Crest Way, Salt Lake City, UT 84101"
    },
    items: [
      { id: "prod-6", name: "SolarFold 28W Portable Panel", price: 115.00, quantity: 1, image: "assets/images/products/prod-solar.webp" },
      { id: "prod-9", name: "Apex 700 Lumen Rechargeable Lantern", price: 58.00, quantity: 1, image: "assets/images/products/prod-lantern.webp" }
    ],
    subtotal: 173.00,
    shippingFee: 0.00,
    discount: 0.00,
    tax: 14.27,
    total: 187.27,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    courier: "USPS Priority Backcountry",
    trackingNumber: "940011189922883391",
    estimatedDelivery: "Delivered on Aug 16",
    notes: ""
  },
  {
    id: "STK-44120",
    date: "Nov 02, 2026",
    customer: {
      id: "usr-cust-01",
      name: "Alex Rivers",
      email: "alex@backcountry.com",
      phone: "+1 (303) 847-2910",
      shippingAddress: "1420 Pine Needle Way, Boulder, CO 80301"
    },
    items: [
      { id: "prod-11", name: "Ridgeline All-Weather Hammock", price: 68.00, quantity: 1, image: "assets/images/products/prod-hammock.webp" }
    ],
    subtotal: 68.00,
    shippingFee: 9.95,
    discount: 0.00,
    tax: 5.61,
    total: 83.56,
    paymentStatus: "Paid",
    fulfillmentStatus: "Pending",
    courier: "Pending Dispatch",
    trackingNumber: "Pending Assignment",
    estimatedDelivery: "Nov 08, 2026",
    notes: "Standard ground delivery."
  }
];

// Initial Seed Addresses
const DEFAULT_ADDRESSES = [
  {
    id: "addr-01",
    userId: "usr-cust-01",
    label: "Primary Trail Base (Home)",
    fullName: "Alex Rivers",
    street: "1420 Pine Needle Way",
    apt: "Suite 4B",
    city: "Boulder",
    state: "Colorado",
    zip: "80301",
    country: "United States",
    phone: "+1 (303) 847-2910",
    isDefault: true
  },
  {
    id: "addr-02",
    userId: "usr-cust-01",
    label: "Mountain Cabin",
    fullName: "Alex Rivers",
    street: "88 Timberline Pass",
    apt: "",
    city: "Breckenridge",
    state: "Colorado",
    zip: "80424",
    country: "United States",
    phone: "+1 (303) 847-2910",
    isDefault: false
  }
];

// Initial Seed Payment Cards
const DEFAULT_PAYMENTS = [
  {
    id: "card-01",
    userId: "usr-cust-01",
    cardBrand: "Visa",
    last4: "4242",
    cardHolder: "Alex Rivers",
    expiry: "08/28",
    isDefault: true
  },
  {
    id: "card-02",
    userId: "usr-cust-01",
    cardBrand: "Mastercard",
    last4: "8891",
    cardHolder: "Alex Rivers",
    expiry: "11/27",
    isDefault: false
  }
];

// Initial Seed Settings
const DEFAULT_SETTINGS = {
  storeName: "Stackly Outdoor & Camping Co.",
  supportEmail: "hq@stackly.com",
  phone: "+1 (800) 555-CAMP",
  headquarters: "1040 Pearl St, Suite 200, Boulder, CO 80302",
  currency: "USD ($)",
  currencySymbol: "$",
  freeShippingThreshold: 75.00,
  standardShippingFee: 9.95,
  expressShippingFee: 19.95,
  taxRatePercent: 8.25,
  notifyLowStockThreshold: 5,
  orderAutoConfirm: true
};

// Initial Seed Vouchers for Loyalty
const DEFAULT_VOUCHERS = [
  {
    id: "vouch-01",
    code: "TRAIL10-SUMMIT",
    title: "$10 Off Any Gear Purchase",
    pointsRequired: 500,
    discountAmount: 10.00,
    minSpend: 50.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-02",
    code: "ALPINEREWARD25",
    title: "$25 Off Any Gear Purchase",
    pointsRequired: 1000,
    discountAmount: 25.00,
    minSpend: 100.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-03",
    code: "AGTYYHHH",
    title: "Complimentary ANY URGENT GEAR ITEM",
    pointsRequired: 1200,
    discountAmount: 24.00,
    minSpend: 0.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-04",
    code: "GOBOULT",
    title: "getting of more boult Mug",
    pointsRequired: 1200,
    discountAmount: 24.00,
    minSpend: 0.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-05",
    code: "BUSS20",
    title: "Getting busy Titanium Camp Mug",
    pointsRequired: 1200,
    discountAmount: 24.00,
    minSpend: 0.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-06",
    code: "ANY2778",
    title: "Changing behaviour bgtt",
    pointsRequired: 1200,
    discountAmount: 24.00,
    minSpend: 0.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  },
  {
    id: "vouch-07",
    code: "LAPTOPGGT",
    title: "Gali valugu gulabi valaga",
    pointsRequired: 1200,
    discountAmount: 24.00,
    minSpend: 0.00,
    redeemed: false,
    expiryDate: "Dec 31, 2026"
  }
];

class DashboardDataManager {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      if (!localStorage.getItem(DASHBOARD_ORDERS_KEY)) {
        localStorage.setItem(DASHBOARD_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      }
      if (!localStorage.getItem(DASHBOARD_PRODUCTS_KEY)) {
        // Use STACKLY_PRODUCTS if defined in window, otherwise minimal fallback
        const baseProds = (typeof STACKLY_PRODUCTS !== "undefined" && Array.isArray(STACKLY_PRODUCTS))
          ? STACKLY_PRODUCTS
          : [];
        localStorage.setItem(DASHBOARD_PRODUCTS_KEY, JSON.stringify(baseProds));
      }
      if (!localStorage.getItem(DASHBOARD_ADDRESSES_KEY)) {
        localStorage.setItem(DASHBOARD_ADDRESSES_KEY, JSON.stringify(DEFAULT_ADDRESSES));
      }
      if (!localStorage.getItem(DASHBOARD_PAYMENTS_KEY)) {
        localStorage.setItem(DASHBOARD_PAYMENTS_KEY, JSON.stringify(DEFAULT_PAYMENTS));
      }
      if (!localStorage.getItem(DASHBOARD_SETTINGS_KEY)) {
        localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
      if (!localStorage.getItem(DASHBOARD_VOUCHERS_KEY)) {
        localStorage.setItem(DASHBOARD_VOUCHERS_KEY, JSON.stringify(DEFAULT_VOUCHERS));
      }
    } catch (e) {
      console.warn("Storage initialization warning:", e);
    }
  }

  // --- Orders API ---
  getOrders() {
    try {
      const data = localStorage.getItem(DASHBOARD_ORDERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_ORDERS;
    } catch (e) {
      return DEFAULT_ORDERS;
    }
  }

  saveOrders(orders) {
    try {
      localStorage.setItem(DASHBOARD_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders:", e);
    }
  }

  getOrderById(id) {
    return this.getOrders().find(o => o.id === id) || null;
  }

  getCustomerOrders(userEmail) {
    if (!userEmail) return [];
    const cleanEmail = userEmail.toLowerCase();
    return this.getOrders().filter(o => 
      o.customer && o.customer.email && o.customer.email.toLowerCase() === cleanEmail
    );
  }

  updateOrderStatus(orderId, newFulfillmentStatus, trackingNumber = null) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: "Order not found" };

    order.fulfillmentStatus = newFulfillmentStatus;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (newFulfillmentStatus === "Delivered") {
      order.estimatedDelivery = "Delivered on " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    this.saveOrders(orders);
    return { success: true, order };
  }

  createOrder(orderData) {
    const orders = this.getOrders();
    orders.unshift(orderData);
    this.saveOrders(orders);
    return orderData;
  }

  cancelOrder(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false };
    order.fulfillmentStatus = "Cancelled";
    this.saveOrders(orders);
    return { success: true, order };
  }

  // --- Products API ---
  getProducts() {
    try {
      const data = localStorage.getItem(DASHBOARD_PRODUCTS_KEY);
      if (data && JSON.parse(data).length > 0) {
        return JSON.parse(data);
      }
      if (typeof STACKLY_PRODUCTS !== "undefined" && Array.isArray(STACKLY_PRODUCTS)) {
        return STACKLY_PRODUCTS;
      }
      return [];
    } catch (e) {
      return (typeof STACKLY_PRODUCTS !== "undefined") ? STACKLY_PRODUCTS : [];
    }
  }

  saveProducts(products) {
    try {
      localStorage.setItem(DASHBOARD_PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products:", e);
    }
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id) || null;
  }

  addProduct(newProduct) {
    const prods = this.getProducts();
    const product = {
      id: "prod-" + (prods.length + 1) + "-" + Math.floor(100 + Math.random() * 900),
      name: newProduct.name,
      category: newProduct.category || "tents",
      categoryLabel: newProduct.categoryLabel || "Tents & Shelter",
      price: parseFloat(newProduct.price) || 99.00,
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
      rating: 5.0,
      reviewCount: 1,
      badge: newProduct.badge || "New Arrival",
      image: newProduct.image || "assets/images/products/prod-tent.webp",
      gallery: [newProduct.image || "assets/images/products/prod-tent.webp"],
      shortDesc: newProduct.shortDesc || "Engineered for high-altitude resilience and all-weather backcountry conditions.",
      description: newProduct.description || "Crafted to meet Stackly's strict outdoor standards with premium lightweight materials.",
      specs: {
        "Materials": "Ripstop Recycled Poly",
        "Warranty": "Stackly Lifetime Trail Warranty"
      },
      inStock: (parseInt(newProduct.stockCount, 10) || 0) > 0,
      stockCount: parseInt(newProduct.stockCount, 10) || 12,
      isFeatured: !!newProduct.isFeatured
    };

    prods.unshift(product);
    this.saveProducts(prods);
    return product;
  }

  updateProduct(id, updatedFields) {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) return null;

    prods[idx] = { ...prods[idx], ...updatedFields };
    if (typeof updatedFields.stockCount !== "undefined") {
      prods[idx].inStock = prods[idx].stockCount > 0;
    }
    this.saveProducts(prods);
    return prods[idx];
  }

  adjustStock(id, delta) {
    const prods = this.getProducts();
    const prod = prods.find(p => p.id === id);
    if (!prod) return null;

    const count = Math.max(0, (prod.stockCount || 0) + delta);
    prod.stockCount = count;
    prod.inStock = count > 0;
    this.saveProducts(prods);
    return prod;
  }

  deleteProduct(id) {
    let prods = this.getProducts();
    prods = prods.filter(p => p.id !== id);
    this.saveProducts(prods);
    return true;
  }

  // --- Saved Addresses API ---
  getAddresses(userId = null) {
    try {
      const data = localStorage.getItem(DASHBOARD_ADDRESSES_KEY);
      const list = data ? JSON.parse(data) : DEFAULT_ADDRESSES;
      if (userId) {
        return list.filter(a => a.userId === userId);
      }
      return list;
    } catch (e) {
      return DEFAULT_ADDRESSES;
    }
  }

  saveAddresses(addresses) {
    try {
      localStorage.setItem(DASHBOARD_ADDRESSES_KEY, JSON.stringify(addresses));
    } catch (e) {}
  }

  addAddress(addressData) {
    const list = this.getAddresses();
    if (addressData.isDefault) {
      list.forEach(a => { if (a.userId === addressData.userId) a.isDefault = false; });
    }
    const newAddr = {
      id: "addr-" + Date.now(),
      ...addressData
    };
    list.unshift(newAddr);
    this.saveAddresses(list);
    return newAddr;
  }

  deleteAddress(id) {
    let list = this.getAddresses();
    list = list.filter(a => a.id !== id);
    this.saveAddresses(list);
    return true;
  }

  setDefaultAddress(id, userId) {
    const list = this.getAddresses();
    list.forEach(a => {
      if (a.userId === userId) {
        a.isDefault = (a.id === id);
      }
    });
    this.saveAddresses(list);
    return true;
  }

  // --- Payment Methods API ---
  getPaymentCards(userId = null) {
    try {
      const data = localStorage.getItem(DASHBOARD_PAYMENTS_KEY);
      const list = data ? JSON.parse(data) : DEFAULT_PAYMENTS;
      if (userId) {
        return list.filter(c => c.userId === userId);
      }
      return list;
    } catch (e) {
      return DEFAULT_PAYMENTS;
    }
  }

  savePaymentCards(cards) {
    try {
      localStorage.setItem(DASHBOARD_PAYMENTS_KEY, JSON.stringify(cards));
    } catch (e) {}
  }

  addPaymentCard(cardData) {
    const list = this.getPaymentCards();
    if (cardData.isDefault) {
      list.forEach(c => { if (c.userId === cardData.userId) c.isDefault = false; });
    }
    const newCard = {
      id: "card-" + Date.now(),
      ...cardData
    };
    list.unshift(newCard);
    this.savePaymentCards(list);
    return newCard;
  }

  deletePaymentCard(id) {
    let list = this.getPaymentCards();
    list = list.filter(c => c.id !== id);
    this.savePaymentCards(list);
    return true;
  }

  // --- Rewards & Vouchers API ---
  getVouchers() {
    try {
      const data = localStorage.getItem(DASHBOARD_VOUCHERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_VOUCHERS;
    } catch (e) {
      return DEFAULT_VOUCHERS;
    }
  }

  saveVouchers(vouchers) {
    try {
      localStorage.setItem(DASHBOARD_VOUCHERS_KEY, JSON.stringify(vouchers));
    } catch (e) {}
  }

  redeemVoucher(voucherId, user) {
    const vouchers = this.getVouchers();
    const voucher = vouchers.find(v => v.id === voucherId);
    if (!voucher) return { success: false, message: "Voucher not found." };
    if (voucher.redeemed) return { success: false, message: "Voucher already redeemed." };

    if ((user.trailPoints || 0) < voucher.pointsRequired) {
      return { success: false, message: `You need ${voucher.pointsRequired} trail points. Current balance: ${user.trailPoints || 0} pts.` };
    }

    // Deduct points from user
    user.trailPoints -= voucher.pointsRequired;
    if (window.stacklyAuth) {
      window.stacklyAuth.setCurrentUser(user);
      // Update in users database
      const users = window.stacklyAuth.getUsers();
      const uIdx = users.findIndex(u => u.id === user.id);
      if (uIdx > -1) {
        users[uIdx].trailPoints = user.trailPoints;
        window.stacklyAuth.saveUsers(users);
      }
    }

    voucher.redeemed = true;
    voucher.redeemedDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    this.saveVouchers(vouchers);

    return { success: true, voucher, newPoints: user.trailPoints };
  }

  // --- Store Settings API ---
  getSettings() {
    try {
      const data = localStorage.getItem(DASHBOARD_SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  // --- Reset Entire Demo Store Data ---
  resetAllDemoData() {
    try {
      localStorage.setItem(DASHBOARD_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      if (typeof STACKLY_PRODUCTS !== "undefined" && Array.isArray(STACKLY_PRODUCTS)) {
        localStorage.setItem(DASHBOARD_PRODUCTS_KEY, JSON.stringify(STACKLY_PRODUCTS));
      }
      localStorage.setItem(DASHBOARD_ADDRESSES_KEY, JSON.stringify(DEFAULT_ADDRESSES));
      localStorage.setItem(DASHBOARD_PAYMENTS_KEY, JSON.stringify(DEFAULT_PAYMENTS));
      localStorage.setItem(DASHBOARD_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(DASHBOARD_VOUCHERS_KEY, JSON.stringify(DEFAULT_VOUCHERS));
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Global Singleton Initialization
window.stacklyData = new DashboardDataManager();
