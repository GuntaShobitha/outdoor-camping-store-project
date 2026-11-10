/**
 * STACKLY OUTDOOR & CAMPING - Backcountry Adventure Dashboard Engine
 * Implements the 10 management sections for the Customer Dashboard:
 * A. Dashboard Welcome Section (personalized greeting, outdoor weather banner)
 * B. Adventure Statistics (Total Adventures, Upcoming, Completed, Saved Destinations)
 * C. Upcoming Adventures (detailed active booking cards)
 * D. My Bookings (Active, Completed, Cancelled tabs + search & filter)
 * E. Saved Destinations (cards with trail specs + interactive Trip Planner)
 * F. My Adventure Wishlist (gear & package wishlist management)
 * G. Recommended Adventures (personalized cards)
 * H. Recent Activities (timestamped timeline)
 * I. User Profile (editing + emergency backcountry contacts + password change)
 * J. Notifications (alerts with read/unread states)
 */

const ADVENTURE_BOOKINGS_KEY = "stackly_adv_bookings_v1";
const SAVED_DESTINATIONS_KEY = "stackly_saved_destinations_v1";
const NOTIFICATIONS_KEY = "stackly_notifications_v1";
const ACTIVITIES_KEY = "stackly_activities_v1";

const DEFAULT_ADVENTURE_BOOKINGS = [
  {
    id: "ADV-4029",
    title: "Alpine High Sierra 4-Day Ridge Trek",
    destination: "Emerald Lake & Glacier Tarn",
    dates: "Nov 18 - 21, 2026",
    participants: 2,
    status: "Confirmed",
    type: "Trekking",
    guide: "Elena Vance (Lead Geologist & WFR)",
    price: 580.00,
    image: "assets/images/destinations/dest-emerald-lake.webp",
    permitNumber: "BLM-CO-99214",
    meetingPoint: "Rocky Mountain West Trailhead, 07:00 AM",
    gearIncluded: "4-Season Tent, Sub-Zero Bag, Rations, Satellite Beacon"
  },
  {
    id: "ADV-3810",
    title: "Redwood Canopy Camping Retreat",
    destination: "Olympic Hoh Rainforest Valley",
    dates: "Dec 05 - 08, 2026",
    participants: 4,
    status: "Confirmed",
    type: "Camping",
    guide: "Marcus Thorne (Chief Expedition Officer)",
    price: 380.00,
    image: "assets/images/destinations/dest-olympic-rainforest.webp",
    permitNumber: "ONP-WA-12044",
    meetingPoint: "Hoh Rainforest Ranger Station, 09:30 AM",
    gearIncluded: "Canvas Glamping Bell Tent, Wood Stove, Rations"
  },
  {
    id: "ADV-2901",
    title: "Maroon Bells Wilderness Summit Camp",
    destination: "Maroon Bells Snowmass Wilderness",
    dates: "Aug 12 - 16, 2026",
    participants: 2,
    status: "Completed",
    type: "Camping",
    guide: "Elena Vance (Lead Geologist)",
    price: 490.00,
    image: "assets/images/destinations/dest-maroon-bells.webp",
    permitNumber: "USFS-CO-77182",
    meetingPoint: "Aspen High Col Trailhead",
    gearIncluded: "Summit Ridge Geodesic Dome, Titanium Stove Kit"
  },
  {
    id: "ADV-2150",
    title: "Sedona Secret Mountain Canyon Trek",
    destination: "Coconino Red Rock Wilderness",
    dates: "May 04 - 08, 2026",
    participants: 2,
    status: "Completed",
    type: "Trekking",
    guide: "Kai Tanaka (Alpine Safety Lead)",
    price: 640.00,
    image: "assets/images/destinations/dest-sedona-canyon.webp",
    permitNumber: "NPS-AZ-33011",
    meetingPoint: "Dry Creek Basin Ranger Post",
    gearIncluded: "Ultralight 65L Packs, Carbon Trekking Poles"
  },
  {
    id: "ADV-1802",
    title: "Cascade Alpine Winter Survival Intensive",
    destination: "Glacier Peak High Route",
    dates: "Jan 14 - 17, 2026",
    participants: 1,
    status: "Cancelled",
    type: "Survival",
    guide: "Kai Tanaka (Alpine Safety Lead)",
    price: 320.00,
    image: "assets/images/destinations/dest-glacier-peak.webp",
    permitNumber: "USFS-WA-00912",
    meetingPoint: "Sauk River Mountain Col",
    gearIncluded: "Winter Bivouac Gear, Snowshoes, Satellite Beacon"
  }
];

const DEFAULT_SAVED_DESTINATIONS = [
  {
    id: "dest-1",
    name: "Emerald Lake & Glacier Tarn",
    region: "Rocky Mountain National Park, CO",
    distance: "9.4 Miles RT",
    elevationGain: "2,140 FT",
    difficulty: "Moderate",
    bestSeason: "June - October",
    image: "assets/images/destinations/dest-emerald-lake.webp",
    description: "Pristine glacial cirque reflecting jagged granite peaks. World-class alpine trout fishing and backcountry campsites."
  },
  {
    id: "dest-2",
    name: "Maroon Bells Snowmass Wilderness",
    region: "White River National Forest, CO",
    distance: "28.0 Miles Loop",
    elevationGain: "4,500 FT",
    difficulty: "Challenging",
    bestSeason: "July - September",
    image: "assets/images/destinations/dest-maroon-bells.webp",
    description: "Iconic striped mudstone summits above turquoise alpine lakes with 4 distinct high mountain passes."
  },
  {
    id: "dest-3",
    name: "Hoh Rainforest River Valley",
    region: "Olympic National Park, WA",
    distance: "17.5 Miles",
    elevationGain: "1,200 FT",
    difficulty: "Easy - Moderate",
    bestSeason: "Year-Round",
    image: "assets/images/destinations/dest-olympic-rainforest.webp",
    description: "Lush ancient moss-draped canopies, Roosevelt elk herds, and tranquil glacier-fed river bar campsites."
  },
  {
    id: "dest-4",
    name: "Glacier Peak High Ridge Route",
    region: "North Cascades Wilderness, WA",
    distance: "32.0 Miles",
    elevationGain: "6,200 FT",
    difficulty: "Strenuous",
    bestSeason: "August - September",
    image: "assets/images/destinations/dest-glacier-peak.webp",
    description: "Remote, untamed Pacific Northwest volcano traverse requiring technical map & compass route-finding."
  },
  {
    id: "dest-5",
    name: "Sedona Secret Mountain Canyon",
    region: "Coconino National Forest, AZ",
    distance: "11.2 Miles",
    elevationGain: "1,850 FT",
    difficulty: "Moderate",
    bestSeason: "October - April",
    image: "assets/images/destinations/dest-sedona-canyon.webp",
    description: "Towering red rock sandstone cliffs, natural rock arches, and dramatic canyon floor cottonwood groves."
  },
  {
    id: "dest-6",
    name: "Lamar Valley Wildlife Basin",
    region: "Yellowstone National Park, WY",
    distance: "14.0 Miles",
    elevationGain: "850 FT",
    difficulty: "Easy",
    bestSeason: "May - October",
    image: "assets/images/destinations/dest-yellowstone-basin.webp",
    description: "America's Serengeti with sweeping open grasslands, bison migrations, and apex predator observation points."
  }
];

const DEFAULT_RECOMMENDED_ADVENTURES = [
  {
    id: "rec-1",
    title: "Wind River High Col Packraft Expedition",
    location: "Wyoming Wilderness",
    duration: "5 Days &bull; 4 Nights",
    difficulty: "Advanced",
    price: "$620",
    image: "assets/images/sections/adv-alpine.webp",
    tag: "High Alpine"
  },
  {
    id: "rec-2",
    title: "Black Canyon Starlight Glamping Weekend",
    location: "Colorado Plateau",
    duration: "3 Days &bull; 2 Nights",
    difficulty: "Relaxed",
    price: "$340",
    image: "assets/images/sections/adv-canyon.webp",
    tag: "Dark Sky"
  },
  {
    id: "rec-3",
    title: "Pacific Coastline Rainforest Bivouac",
    location: "Olympic National Park",
    duration: "4 Days &bull; 3 Nights",
    difficulty: "Moderate",
    price: "$480",
    image: "assets/images/sections/adv-fjord.webp",
    tag: "Coast & Forest"
  }
];

const DEFAULT_ACTIVITIES = [
  { icon: "camping", title: "Booked Alpine High Sierra Ridge Trek (2 explorers)", time: "2 hours ago", type: "booking" },
  { icon: "star", title: "Added Emerald Lake Wilderness to Saved Destinations", time: "Yesterday", type: "destination" },
  { icon: "rate_review", title: "Completed gear review for Summit Ridge 2P Ultralight Tent", time: "3 days ago", type: "review" },
  { icon: "bolt", title: "Earned 250 Trail Club points for summit dispatch submission", time: "5 days ago", type: "points" },
  { icon: "security", title: "Updated Emergency Backcountry Contact (Sarah Rivers)", time: "1 week ago", type: "security" }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Expedition Confirmation: Alpine High Sierra Trek",
    message: "Wilderness permit #BLM-CO-99214 has been issued. Check your email for trailhead meeting logistics.",
    time: "Today, 10:30 AM",
    unread: true,
    category: "booking"
  },
  {
    id: "notif-2",
    title: "Weather Advisory: Light Snow at Maroon Bells",
    message: "Early mountain frost forecasted above 10,000ft this weekend. Ensure 4-season thermal sleep rating.",
    time: "Yesterday, 3:15 PM",
    unread: true,
    category: "weather"
  },
  {
    id: "notif-3",
    title: "Member Exclusive: $50 Equipment Rental Voucher",
    message: "Your Tier 3 Summit Explorer benefits include a seasonal $50 gear rental voucher code: TRAIL50.",
    time: "3 days ago",
    unread: false,
    category: "perk"
  },
  {
    id: "notif-4",
    title: "Trail Advisory: Sauk River Col Bridge Detour",
    message: "Glacier Peak high route bridge maintenance in progress. Follow alternate blue-blazed contour line.",
    time: "5 days ago",
    unread: false,
    category: "advisory"
  }
];

class AdventureDashboardEngine {
  constructor() {
    this.authManager = window.stacklyAuth;
    this.currentUser = this.authManager ? this.authManager.currentUser : null;
    this.initData();
    this.initControllers();
  }

  initData() {
    if (!localStorage.getItem(ADVENTURE_BOOKINGS_KEY)) {
      localStorage.setItem(ADVENTURE_BOOKINGS_KEY, JSON.stringify(DEFAULT_ADVENTURE_BOOKINGS));
    }
    if (!localStorage.getItem(SAVED_DESTINATIONS_KEY)) {
      localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(DEFAULT_SAVED_DESTINATIONS));
    }
    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    if (!localStorage.getItem(ACTIVITIES_KEY)) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
    }
  }

  getBookings() {
    try {
      const raw = localStorage.getItem(ADVENTURE_BOOKINGS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ADVENTURE_BOOKINGS;
    } catch (e) {
      return DEFAULT_ADVENTURE_BOOKINGS;
    }
  }

  getDestinations() {
    try {
      const raw = localStorage.getItem(SAVED_DESTINATIONS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_SAVED_DESTINATIONS;
    } catch (e) {
      return DEFAULT_SAVED_DESTINATIONS;
    }
  }

  getNotifications() {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    } catch (e) {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  getActivities() {
    try {
      const raw = localStorage.getItem(ACTIVITIES_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ACTIVITIES;
    } catch (e) {
      return DEFAULT_ACTIVITIES;
    }
  }

  initControllers() {
    this.renderWelcomeBanner();
    this.renderSidebarUserInfo();
    this.renderStatsCounters();
    this.renderUpcomingAdventures();
    this.renderBookingsTab();
    this.renderDestinationsTab();
    this.renderRecommendedAdventures();
    this.renderRecentActivities();
    this.renderNotificationsTab();
    this.setupModals();
    this.setupProfileEditing();
    this.setupPasswordChange();
  }

  // --- Sidebar User Info (Email and Role at bottom of navbar) ---
  renderSidebarUserInfo() {
    const user = this.currentUser || (window.stacklyAuth ? window.stacklyAuth.currentUser : null) || {
      name: "Alex Rivers",
      email: "alex@backcountry.com",
      role: "customer",
      roleLabel: "Customer / Adventurer"
    };
    const emailEl = document.getElementById("custUserEmail");
    const roleEl = document.getElementById("custUserRole");
    const avatarEl = document.getElementById("custUserAvatar");

    if (emailEl) {
      emailEl.textContent = user.email || "alex@backcountry.com";
      emailEl.title = user.email || "alex@backcountry.com";
    }
    if (roleEl) {
      roleEl.textContent = user.roleLabel || "Customer / Adventurer";
    }
    if (avatarEl) {
      const initial = (user.email || user.name || "U").charAt(0).toUpperCase();
      avatarEl.textContent = initial;
    }

    const logoutBtn = document.getElementById("custLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (this.authManager) {
          this.authManager.logout("login.html");
        } else if (window.stacklyAuth) {
          window.stacklyAuth.logout("login.html");
        }
      });
    }
  }

  // --- A. Welcome Banner ---
  renderWelcomeBanner() {
    const greetingEl = document.getElementById("dashUserGreeting");
    if (greetingEl) {
      const name = this.currentUser ? this.currentUser.name.split(" ")[0] : "Explorer";
      greetingEl.textContent = `Welcome back, ${name}!`;
    }
  }

  // --- B. Animated Adventure Statistics ---
  renderStatsCounters() {
    const bookings = this.getBookings();
    const destinations = this.getDestinations();

    const totalCount = bookings.length;
    const upcomingCount = bookings.filter(b => b.status === "Confirmed").length;
    const completedCount = bookings.filter(b => b.status === "Completed").length;
    const savedCount = destinations.length;

    const elTotal = document.getElementById("statTotalAdventures");
    const elUpcoming = document.getElementById("statUpcomingTrips");
    const elCompleted = document.getElementById("statCompletedAdventures");
    const elSaved = document.getElementById("statSavedDestinations");

    if (elTotal) elTotal.textContent = totalCount;
    if (elUpcoming) elUpcoming.textContent = upcomingCount;
    if (elCompleted) elCompleted.textContent = completedCount;
    if (elSaved) elSaved.textContent = savedCount;
  }

  // --- C. Upcoming Adventures ---
  renderUpcomingAdventures() {
    const container = document.getElementById("dashUpcomingAdventuresGrid");
    if (!container) return;

    const upcoming = this.getBookings().filter(b => b.status === "Confirmed");
    if (!upcoming.length) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--color-text-muted);">No upcoming trips booked right now. <a href="services.html" style="color:var(--color-gold); font-weight:700;">Explore Expeditions <span class="material-symbols-outlined">arrow_forward</span></a></div>`;
      return;
    }

    container.innerHTML = upcoming.map(b => `
      <div class="dash-panel" style="display:flex; flex-direction:column; justify-content:space-between; border-left:4px solid var(--color-gold);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <span class="order-badge delivered" style="background:rgba(100,124,80,0.18); color:var(--color-dark-green); font-weight:700;">${b.status}</span>
            <span style="font-size:0.75rem; color:var(--color-text-muted); font-family:var(--font-mono, monospace);">${b.id}</span>
          </div>
          <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--color-dark-green); margin-bottom:6px;">${b.title}</h4>
          <p style="font-size:0.86rem; color:var(--color-text-body); margin-bottom:12px;"><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-gold); margin-right:4px;">location_on</span> ${b.destination}</p>
          <div style="font-size:0.82rem; color:var(--color-text-muted); line-height:1.6; border-top:1px dashed #eee; padding-top:10px;">
            <div><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">calendar_today</span> <strong>Dates:</strong> ${b.dates}</div>
            <div><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">groups</span> <strong>Party:</strong> ${b.participants} Explorers</div>
            <div><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">explore</span> <strong>Guide:</strong> ${b.guide}</div>
          </div>
        </div>
        <div style="margin-top:16px; display:flex; gap:10px;">
          <button type="button" class="dash-btn dash-btn-primary dash-btn-sm view-adv-details-btn" data-id="${b.id}" style="flex:1;">View Details</button>
          <button type="button" class="dash-btn dash-btn-outline dash-btn-sm" onclick="window.location.href='./404.html'">Permit</button>
        </div>
      </div>
    `).join("");

    this.bindBookingDetailButtons();
  }

  // --- D. My Bookings Tab Management ---
  renderBookingsTab(filterStatus = "all", searchQuery = "") {
    const listEl = document.getElementById("dashBookingsList");
    if (!listEl) return;

    let list = this.getBookings();
    if (filterStatus !== "all") {
      list = list.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b => b.title.toLowerCase().includes(q) || b.destination.toLowerCase().includes(q));
    }

    if (!list.length) {
      listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--color-text-muted);">No bookings match your current filter.</div>`;
      return;
    }

    listEl.innerHTML = list.map(b => `
     <div class="dash-panel booking-card">

  <!-- Booking Image -->
  <div class="booking-image">
    <img src="${b.image}" alt="${b.title}" />
  </div>

  <!-- Booking Information -->
  <div class="booking-info">

    <div class="booking-meta">
      <span class="order-badge ${
        b.status === 'Confirmed' || b.status === 'Completed'
          ? 'delivered'
          : 'cancelled'
      }">
        ${b.status}
      </span>

      <span class="booking-reference">
        ${b.type} &bull; Permit #${b.permitNumber}
      </span>
    </div>

    <h4 class="booking-title">${b.title}</h4>

    <p class="booking-location">
      <span class="material-symbols-outlined location-icon">
        location_on
      </span>
      ${b.destination}

      <span class="booking-separator">&bull;</span>

      <span class="material-symbols-outlined calendar-icon">
        calendar_today
      </span>
      ${b.dates}
    </p>

  </div>

  <!-- Booking Price & Action -->
  <div class="booking-actions">

    <div class="booking-price">
      <strong>$${b.price.toFixed(2)}</strong>
      <span>${b.participants} participants</span>
    </div>

    <button
      type="button"
      class="dash-btn dash-btn-outline dash-btn-sm view-adv-details-btn"
      data-id="${b.id}">
      View Details
    </button>

  </div>

</div>
    `).join("");

    this.bindBookingDetailButtons();
  }

  bindBookingDetailButtons() {
    document.querySelectorAll(".view-adv-details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.openBookingModal(id);
      });
    });
  }

  openBookingModal(bookingId) {
    const booking = this.getBookings().find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById("dashBookingDetailsModal");
    const content = document.getElementById("dashBookingModalContent");
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; gap:18px; margin-bottom:20px; align-items:center;">
        <img src="${booking.image}" alt="${booking.title}" style="width:100px; height:80px; border-radius:12px; object-fit:cover;" />
        <div>
          <span class="order-badge delivered" style="font-size:0.75rem;">${booking.status}</span>
          <h3 style="font-family:var(--font-serif); font-size:1.3rem; color:var(--color-dark-green); margin-top:4px;">${booking.title}</h3>
          <p style="font-size:0.86rem; color:var(--color-text-muted);">Booking ID: ${booking.id} &bull; Wilderness Permit: ${booking.permitNumber}</p>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; background:var(--color-bg-cream); padding:18px; border-radius:12px; margin-bottom:20px;">
        <div>
          <span style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Destination</span>
          <strong style="display:block; font-size:0.95rem; color:var(--color-dark-green);">${booking.destination}</strong>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Scheduled Dates</span>
          <strong style="display:block; font-size:0.95rem; color:var(--color-dark-green);">${booking.dates}</strong>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Participants</span>
          <strong style="display:block; font-size:0.95rem; color:var(--color-dark-green);">${booking.participants} Explorers</strong>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Wilderness Guide</span>
          <strong style="display:block; font-size:0.95rem; color:var(--color-dark-green);">${booking.guide}</strong>
        </div>
      </div>

      <div style="margin-bottom:18px;">
        <strong style="display:block; font-size:0.88rem; color:var(--color-dark-green); margin-bottom:4px;">Meeting Point Logistics</strong>
        <p style="font-size:0.86rem; color:var(--color-text-body);">${booking.meetingPoint}</p>
      </div>

      <div style="margin-bottom:24px;">
        <strong style="display:block; font-size:0.88rem; color:var(--color-dark-green); margin-bottom:4px;">Provided Backcountry Gear</strong>
        <p style="font-size:0.86rem; color:var(--color-text-body);">${booking.gearIncluded}</p>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eee; padding-top:16px;">
        <span style="font-size:1.1rem; font-weight:800; color:var(--color-dark-green);">Total Paid: $${booking.price.toFixed(2)}</span>
        <button type="button" class="dash-btn dash-btn-primary dash-btn-sm" onclick="window.location.href='./404.html'">Download Itinerary Slip</button>
      </div>
    `;

    modal.classList.add("active");
  }

  // --- E. Saved Destinations Tab ---
  renderDestinationsTab() {
    const grid = document.getElementById("dashDestinationsGrid");
    if (!grid) return;

    const list = this.getDestinations();
    grid.innerHTML = list.map(d => `
      <div class="dash-panel" style="padding:0; overflow:hidden; border-radius:16px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="position:relative; height:180px;">
            <img src="${d.image}" alt="${d.name}" style="width:100%; height:100%; object-fit:cover;" />
            <span style="position:absolute; top:12px; right:12px; background:rgba(16,42,36,0.85); color:#C49A52; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:9999px;">
              ${d.difficulty}
            </span>
          </div>
          <div style="padding:18px;">
            <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--color-dark-green); margin-bottom:4px;">${d.name}</h4>
            <span style="font-size:0.78rem; color:var(--color-text-muted); display:block; margin-bottom:8px;"><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-gold); margin-right:4px;">location_on</span> ${d.region}</span>
            <p style="font-size:0.85rem; color:var(--color-text-body); line-height:1.5; margin-bottom:14px;">${d.description}</p>
            <div style="display:flex; gap:16px; font-size:0.78rem; color:var(--color-text-muted); border-top:1px solid #eee; padding-top:10px;">
              <span><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">hiking</span> ${d.distance}</span>
              <span><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-primary-green); margin-right:4px;">landscape</span> +${d.elevationGain}</span>
            </div>
          </div>
        </div>
        <div style="padding:0 18px 18px;">
          <button type="button" class="dash-btn dash-btn-primary dash-btn-sm" onclick="window.location.href='./404.html'" style="width:100%;">Plan Trip <span class="material-symbols-outlined">arrow_forward</span></button>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".plan-trip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const dest = btn.getAttribute("data-dest");
        alert(`Trip Planner opened for "${dest}"! Route itinerary draft generated.`);
      });
    });
  }

  // --- G. Recommended Adventures ---
  renderRecommendedAdventures() {
    const container = document.getElementById("dashRecommendedGrid");
    if (!container) return;

    container.innerHTML = DEFAULT_RECOMMENDED_ADVENTURES.map(r => `
      <div class="dash-panel" style="padding:0; overflow:hidden; border-radius:16px; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="position:relative; height:150px;">
            <img src="${r.image}" alt="${r.title}" style="width:100%; height:100%; object-fit:cover;" />
            <span style="position:absolute; top:10px; left:10px; background:#102A24; color:#C49A52; font-size:0.7rem; font-weight:700; padding:3px 8px; border-radius:4px;">${r.tag}</span>
          </div>
          <div style="padding:16px;">
            <h4 style="font-family:var(--font-serif); font-size:1.05rem; color:var(--color-dark-green); margin-bottom:4px;">${r.title}</h4>
            <span style="font-size:0.78rem; color:var(--color-text-muted);"><span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle; color:var(--color-gold); margin-right:4px;">location_on</span> ${r.location} &bull; ${r.duration}</span>
          </div>
        </div>
        <div style="padding:0 16px 16px; display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:var(--color-dark-green);">${r.price}</strong>
          <a href="./404.html" class="dash-btn dash-btn-outline dash-btn-sm">Explore</a>
        </div>
      </div>
    `).join("");
  }

  // --- H. Recent Activities ---
  renderRecentActivities() {
    const list = document.getElementById("dashRecentActivitiesList");
    if (!list) return;

    const activities = this.getActivities();
    list.innerHTML = activities.map(a => `
      <div style="display:flex; align-items:flex-start; gap:14px; padding:12px 0; border-bottom:1px solid rgba(0,0,0,0.06);">
        
        <div style="flex:1;">
          <strong style="display:block; font-size:0.88rem; color:var(--color-dark-green);">${a.title}</strong>
          <small style="color:var(--color-text-muted); font-size:0.75rem;">${a.time}</small>
        </div>
      </div>
    `).join("");
  }

  // --- J. Notifications Tab ---
  renderNotificationsTab() {
    const container = document.getElementById("dashNotificationsList");
    if (!container) return;

    const notifs = this.getNotifications();
    container.innerHTML = notifs.map(n => `
      <div class="dash-panel" style="margin-bottom:12px; display:flex; gap:16px; align-items:flex-start; border-left:4px solid ${n.unread ? 'var(--color-gold)' : 'var(--color-border)'};">
        <span class="material-symbols-outlined" style="font-size:1.5rem; color:${n.unread ? 'var(--color-gold)' : 'var(--color-primary-green)'};">${n.category === 'booking' ? 'camping' : n.category === 'weather' ? 'cloudy_snowing' : n.category === 'perk' ? 'loyalty' : 'warning'}</span>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--color-dark-green); font-size:0.95rem;">${n.title}</strong>
            <small style="color:var(--color-text-muted); font-size:0.75rem;">${n.time}</small>
          </div>
          <p style="font-size:0.86rem; color:var(--color-text-body); margin-top:4px;">${n.message}</p>
        </div>
      </div>
    `).join("");
  }

  // --- Setup Profile Editing Persistence ---
  setupProfileEditing() {
    const form = document.getElementById("custEditProfileForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = this.currentUser || { id: "usr-cust-01" };
        user.name = document.getElementById("profileFullName").value.trim() || user.name;
        user.phone = document.getElementById("profilePhone").value.trim() || user.phone;
        user.location = document.getElementById("profileLocation").value.trim() || user.location;
        user.bio = document.getElementById("profileBio").value.trim() || "Backcountry adventurer.";

        if (window.stacklyAuth) {
          window.stacklyAuth.setCurrentUser(user);
          const users = window.stacklyAuth.getUsers();
          const idx = users.findIndex(u => u.id === user.id);
          if (idx > -1) {
            users[idx] = { ...users[idx], ...user };
            window.stacklyAuth.saveUsers(users);
          }
        }

        window.location.href='./404.html';
        this.renderWelcomeBanner();
    this.renderSidebarUserInfo();
      });
    }
  }

  // --- Password Change Validation ---
  setupPasswordChange() {
    const form = document.getElementById("custChangePasswordForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentPass = document.getElementById("currentPassInput").value;
        const newPass = document.getElementById("newPassInput").value;
        const confirmPass = document.getElementById("confirmPassInput").value;

        if (!currentPass || !newPass) {
          alert("Please fill out all password fields.");
          return;
        }

        if (newPass.length < 5) {
         window.location.href='./404.html';
          return;
        }

        if (newPass !== confirmPass) {
          alert("New passwords do not match.");
          return;
        }

        alert("Password successfully changed!");
        form.reset();
      });
    }
  }

  setupModals() {
    const modal = document.getElementById("dashBookingDetailsModal");
    const closeBtn = document.getElementById("closeBookingDetailsModalBtn");
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    }
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.adventureDash = new AdventureDashboardEngine();
});
