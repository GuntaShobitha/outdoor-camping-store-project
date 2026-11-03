# STACKLY &mdash; Outdoor & Camping E-Commerce Store

> **Pixel-Perfect Website Reconstruction & Master Implementation**  
> Built strictly using semantic **HTML5**, modern **CSS3**, and modular **Vanilla JavaScript (ES6+)**.  
> No external UI frameworks (No React, Angular, Vue, Bootstrap, Tailwind, or jQuery).

---

## 1. Project Overview & Reference Analysis

This project is a pixel-perfect recreation of the uploaded **Stackly Outdoor & Camping** reference website screenshot, enhanced with three naturally integrated additional sections and full e-commerce frontend functionality.

### Visual Identity & Extracted Design System:
- **Brand Typography**:
  - Headings & Logo: `Cinzel` (Google Fonts, serif, 600–800 weight, majestic tracking)
  - Hero Display Title: `Outfit` (sans-serif / grotesque, 900 weight, tight line-height)
  - Body & UI Controls: `Plus Jakarta Sans` (sans-serif, 400–700 weight, clean legibility)
- **Primary Color Palette**:
  - `Deep Forest Pine Green`: `#143828` / `#10291f` (Hero heading, circular feature badges, banner backgrounds)
  - `Warm Golden Ochre`: `#c8963e` / `#dfa84a` (Brand logo, eyebrow tags, rating stars, arrows)
  - `Warm Background Cream`: `#faf8f5` / `#f3efe8` (Section background matching original reference)
  - `Clean Off-White`: `#ffffff` (Cards, product boxes, publication background)
  - `Charcoal Slate`: `#121c17` / `#4a5951` (High-contrast, accessible body and title copy)
- **Decorative Elements**:
  - Scalable vector topographical contour watermark lines along section margins.
  - Circular dark-green feature badges with precision inline SVGs.
  - Staggered bento / masonry category card layout with rounded corners (`border-radius: 20px`).
  - Atmospheric dark misty pine forest overlay in the footer.
  - Prominent translucent brand watermark: `[ S T A C K L Y ]`.

---

## 2. Directory Structure

```
Outdoor-camping/
│
├── index.html              # Main homepage with all reference sections + 3 additional sections
├── about.html              # Brand heritage, sustainability mission & materials lab
├── shop.html               # Full product catalog with live filters, sorting & wishlist view
├── product-details.html    # Deep product page with gallery thumbnails, technical specs & reviews
├── contact.html            # Boulder HQ details, interactive contact form & FAQ accordion
├── login.html              # Dedicated sign-in portal with role selection & pure JS validation
├── register.html           # Dedicated registration portal with password strength & pure JS validation
├── admin-dashboard.html    # Full Admin Operations Console (Overview, Products, Orders, Customers, Analytics, Settings)
├── customer-dashboard.html # Full Customer Backcountry Hub (Overview, Orders, Wishlist, Addresses, Rewards, Profile)
│
├── css/
│   ├── style.css           # Master stylesheet (tokens, layout, components, cart drawer, modals, user dropdown)
│   ├── auth.css            # Authentication styles (login/register split panel, error states, demo auto-fill)
│   ├── dashboard.css       # Master dashboard styles (collapsible sidebar, KPI cards, data tables, order slips)
│   ├── responsive.css      # Responsive breakpoints (Desktop, Laptop, Tablet, Mobile)
│   └── animations.css      # Micro-interactions, scroll reveal, reduced-motion support
│
├── js/
│   ├── auth.js             # Pure JavaScript authentication, session persistence & validation engine
│   ├── dashboard-data.js   # LocalStorage data store synchronizing orders, catalog, addresses, vouchers
│   ├── dashboard.js        # Interactive controller powering Admin & Customer dashboards
│   ├── products.js         # Complete outdoor gear catalog dataset & dynamic queries
│   ├── cart.js             # Shopping cart engine, checkout order creation, localStorage persistence
│   ├── search.js           # Live search modal, autocomplete, and highlighting
│   ├── validation.js       # Real-time form validation (contact, newsletter, magazine)
│   └── main.js             # App controller, sticky header, mobile nav, wishlist, quick view
│
├── assets/
│   ├── images/
│   │   ├── banners/        # Hero lake kayak, footer misty forest
│   │   ├── categories/     # Camping, apparel, climbing, headwear, hiking, packs
│   │   ├── products/       # Tents, sleeping bags, backpacks, stoves, lanterns, boots, etc.
│   │   └── sections/       # Tent lake view, paddleboard story, magazine stack, avatars
│   │
│   └── icons/              # Inline SVGs embedded directly for zero extra HTTP requests
│
└── README.md               # Complete project documentation and verification report
```
│   │   └── sections/       # Tent lake view, paddleboard story, magazine stack, avatars
│   │
│   └── icons/              # Inline SVGs embedded directly for zero extra HTTP requests
│
└── README.md               # Complete project documentation and verification report
```

---

## 3. Original Reference Sections Recreated

1. **Top Navigation Bar**:
   - Left: `Home`, `About`, `Services`
   - Center: `[STACKLY]` logo in gold serif with letter-spacing
   - Right: `Shop`, `Contact`, Live Search Trigger (`🔍`), Wishlist (`🤍`), and Cart Drawer (`🛒`) with dynamic quantity badges.
2. **Hero Section ("Gear for when it actually matters.")**:
   - Wide mountain lake with turquoise water and kayak paddle perspective.
   - Gold tag: `FOR ADVENTURERS`.
   - Massive forest green display headline matching the reference layout.
   - Direct CTAs to explore gear or view brand story.
3. **Section: "A BIT ABOUT US."**:
   - Rounded corner photo card of a camping tent pitched on a scenic lake overlook.
   - Gold eyebrow `WHO WE ARE`, serif title `A BIT ABOUT US.`, paragraph, and gold arrow link `Read more →`.
   - Decorative topographical contour watermark.
4. **Section: "SETTING THE BAR FOR OUR PRODUCTS." (Our Promise)**:
   - 6 Circular deep pine green feature badges with crisp white icons:
     1. `SUSTAINABLE SOURCING`
     2. `LIFETIME WARRANTY`
     3. `ALL-TERRAIN TESTED`
     4. `PREMIUM MATERIALS`
     5. `DESIGNED BY YOU`
     6. `QUALITY ASSURED`
5. **Section: "WHAT WE HAVE IN STORE FOR YOU." (Category Bento Grid)**:
   - 6 Staggered Category Cards matching the reference rhythm:
     - `CAMPING GEAR` (Campfire by tent at night)
     - `APPAREL` (Hiker walking mountain ridge)
     - `CLIMBING GEAR` (Rock climber ascending steep cliff)
     - `HEADWEAR` (Woman adventurer in outdoor cap)
     - `HIKING GEAR` (Hikers with trekking poles at sunset)
     - `PACKS & BAGS` (Hiker carrying expedition pack)
6. **Story Banner: "A STORY FROM THE WILD"**:
   - Aerial drone view of crystal-clear emerald water with two paddleboarders gliding forward.
   - Translucent dark card with gold accent and link to brand stories.
7. **Callout Banner: "CHECK OUT OUR PRODUCTS"**:
   - Solid forest green background, gold eyebrow, serif title, description, and bordered `[ VISIT SHOP ]` button.
8. **Section: "SUBSCRIBE TO OUR MAGAZINE TODAY."**:
   - Realistic 3D perspective stack of printed outdoor publication issues.
   - Gold eyebrow `SOME LIGHT READING`, serif headline, descriptive text, validated subscription input form, and gold link `Read more →`.
9. **Footer with Misty Pine Forest**:
   - Atmospheric misty pine forest background with dark gradient overlay.
   - 4-Column structure: `Explore`, `Contact`, `Hours`, `Follow`.
   - Huge centered translucent watermark: `[ S T A C K L Y ]`.

---

## 4. The Three Additional Sections

Seamlessly integrated using the exact design tokens, typography, and spacing:

### Section 1: Explore Outdoor Adventures (Expeditions & Destinations)
- Placed immediately following the Paddleboard Story Banner.
- Displays 4 realistic adventure terrain cards:
  1. *Alpine Glaciers & High Summits* (Elevation: 3,850m | Advanced Mountaineering)
  2. *Pacific Northwest Redwood Forests* (Elevation: 650m | Moderate Backpacking)
  3. *Red Rock Desert Canyons* (Elevation: 1,420m | Strenuous Sun & Sand)
  4. *Nordic Fjords & Waterfall Routes* (Elevation: 1,100m | Coastal Traverse)
- Each card includes interactive **"View Trail Guide & Gear"** triggers that open a detailed modal with route briefings, ranger advice, and gear checklists.

### Section 2: Best-Selling Camping Essentials (Live Interactive Product Grid)
- Placed right after the "Visit Shop" Callout.
- Interactive category filter pills (*All Essentials, Tents & Shelter, Sleep Systems, Packs & Bags, Camp Cooking, Lighting & Power*).
- 8 high-performance products loaded dynamically with realistic prices, discounts, star ratings, and stock levels.
- Interactive **"Quick View"** modal, **Wishlist** toggling, and instant **"Add to Cart"** functionality.

### Section 3: Why Choose Our Outdoor Store? (Trust Pillars & Verified Reviews)
- Placed preceding the "Subscribe To Our Magazine" section.
- 4 Core Trust Pillars:
  1. *100% Trail-Tested Guarantee*
  2. *Free Carbon-Neutral Shipping on Orders $75+*
  3. *Lifetime Field Repair & Replacement*
  4. *24/7 Backcountry Mountain Guide Support*
- 3 Verified Adventurer Testimonials with authentic avatars, star ratings, quotes, names, and credentials.

---

## 5. Image Audit & Compliance Report

| File Path | Description | Format | File Size | Compliant (< 90 KB) |
| :--- | :--- | :---: | :---: | :---: |
| `assets/images/banners/hero-lake-kayak.webp` | Lake Kayak / Canoe Hero | `.webp` | 37.05 KB | ✅ Yes |
| `assets/images/banners/footer-misty-forest.webp` | Misty Pine Forest Footer | `.webp` | 76.84 KB | ✅ Yes |
| `assets/images/sections/about-tent-view.webp` | Tent Lake Overlook | `.webp` | 51.79 KB | ✅ Yes |
| `assets/images/sections/story-paddleboard.webp` | Aerial Paddleboard Story | `.webp` | 71.58 KB | ✅ Yes |
| `assets/images/sections/magazine-stack.webp` | 3D Magazine Stack | `.webp` | 21.57 KB | ✅ Yes |
| `assets/images/categories/cat-camping.webp` | Campfire & Tents at Dusk | `.webp` | 58.34 KB | ✅ Yes |
| `assets/images/categories/cat-apparel.webp` | Mountain Ridge Hiker | `.webp` | 64.67 KB | ✅ Yes |
| `assets/images/categories/cat-climbing.webp` | Rock Wall Climber | `.webp` | 43.90 KB | ✅ Yes |
| `assets/images/categories/cat-headwear.webp` | Outdoor Cap Portrait | `.webp` | 23.21 KB | ✅ Yes |
| `assets/images/categories/cat-hiking.webp` | Golden Hour Ridge Hikers | `.webp` | 63.75 KB | ✅ Yes |
| `assets/images/categories/cat-packs.webp` | Expedition Backpacker | `.webp` | 12.02 KB | ✅ Yes |
| `assets/images/sections/adv-alpine.webp` | Alpine Glacial Summits | `.webp` | 79.87 KB | ✅ Yes |
| `assets/images/sections/adv-forest.webp` | Redwood Rainforest | `.webp` | 47.08 KB | ✅ Yes |
| `assets/images/sections/adv-canyon.webp` | Desert Red Rock Canyon | `.webp` | 84.69 KB | ✅ Yes |
| `assets/images/sections/adv-fjord.webp` | Nordic Ocean Fjord | `.webp` | 45.17 KB | ✅ Yes |
| `assets/images/products/prod-tent.webp` | Ultralight 2P Tent | `.webp` | 53.33 KB | ✅ Yes |
| `assets/images/products/prod-sleeping-bag.webp` | 850-Fill Down Sleeping Bag | `.webp` | 73.12 KB | ✅ Yes |
| `assets/images/products/prod-backpack.webp` | 65L Expedition Backpack | `.webp` | 25.98 KB | ✅ Yes |
| `assets/images/products/prod-lantern.webp` | Solar Camping Lantern | `.webp` | 53.66 KB | ✅ Yes |
| `assets/images/products/prod-stove.webp` | Titanium Camp Stove | `.webp` | 45.31 KB | ✅ Yes |
| `assets/images/products/prod-flask.webp` | Insulated Trail Flask | `.webp` | 9.06 KB | ✅ Yes |
| `assets/images/products/prod-poles.webp` | Carbon Trekking Poles | `.webp` | 10.63 KB | ✅ Yes |
| `assets/images/products/prod-boots.webp` | Waterproof Hiking Boots | `.webp` | 29.19 KB | ✅ Yes |
| `assets/images/products/prod-hatchet.webp` | Camp Hatchet | `.webp` | 23.46 KB | ✅ Yes |
| `assets/images/products/prod-hammock.webp` | Parachute Nylon Hammock | `.webp` | 82.21 KB | ✅ Yes |
| `assets/images/products/prod-solar.webp` | Foldable Solar Panel | `.webp` | 46.53 KB | ✅ Yes |
| `assets/images/products/prod-compass.webp` | Heritage Brass Compass | `.webp` | 27.11 KB | ✅ Yes |
| `assets/images/sections/avatar-1.webp` | Elena Rostova Avatar | `.webp` | 10.28 KB | ✅ Yes |
| `assets/images/sections/avatar-2.webp` | Marcus Vance Avatar | `.webp` | 13.61 KB | ✅ Yes |
| `assets/images/sections/avatar-3.webp` | Sarah Chen Avatar | `.webp` | 26.85 KB | ✅ Yes |

**Summary**: 100% of images are in `.webp` format and under 90 KB. No duplicate photos.

---

## 6. Frontend Functionality & Interactions

1. **Shopping Cart Engine (`cart.js`)**:
   - Sliding cart drawer with backdrop blur.
   - Item add, quantity increase/decrease, item removal.
   - Real-time subtotal and estimated total calculation.
   - Free shipping progress bar toward the $75 threshold.
   - Coupon code support (apply code `ADVENTURE10` for 10% off).
   - Full persistence across page refreshes via `localStorage`.
   - Simulated checkout modal with form validation and simulated order confirmation receipt.
2. **Live Search Modal (`search.js`)**:
   - Activated via header search icon or keyboard shortcut.
   - Real-time filtering against product names, categories, and descriptions.
   - Keyword query highlighting in results.
   - Empty state with suggested category pills.
3. **Form Validation Engine (`validation.js`)**:
   - Magazine and newsletter email validation with regex verification.
   - Contact form with name, email, topic, and message checks.
   - Accessible inline error messages and successful dispatch simulations.
4. **Interactive Product Modals (`main.js`)**:
   - Quick View dialog with image gallery thumbnails, specs, and add-to-cart.
   - Wishlist toggle saved to `localStorage` with header counter badge.
   - Trail Guide modal for each adventure destination.
   - Back-to-Top smooth scrolling button.
   - Scroll-reveal animations using native `IntersectionObserver`.

---

## 7. Responsive Verification

Tested across all requested viewport breakpoints:
- **Desktop (1440px+)**: Full expansive layout with container max-width 1360px.
- **Laptop (1024px–1366px)**: Proportional grid column reduction and bento card scaling.
- **Tablet (768px–1023px)**: 2-column grids, mobile header switch, touch-friendly tap targets.
- **Mobile (320px–767px)**: Single column fluid stack, slide-in mobile navigation drawer, zero horizontal overflow.
