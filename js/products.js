/**
 * STACKLY OUTDOOR - Product Catalog Data & Engine
 * High quality, realistic outdoor equipment catalog
 */

const STACKLY_PRODUCTS = [
  {
    id: "prod-1",
    name: "Summit Ridge 2P Ultralight Tent",
    category: "tents",
    categoryLabel: "Tents & Shelter",
    price: 349.00,
    originalPrice: 399.00,
    rating: 4.9,
    reviewCount: 142,
    badge: "Bestseller",
    image: "assets/images/products/prod-tent.webp",
    gallery: [
      "assets/images/products/prod-tent.webp",
      "assets/images/sections/about-tent-view.webp",
      "assets/images/categories/cat-camping.webp"
    ],
    shortDesc: "Engineered for 3-season alpine expeditions with ripstop silicone-coated nylon and featherlight DAC aluminum poles.",
    description: "The Summit Ridge 2P tent represents the pinnacle of backcountry shelter engineering. Weighing just 2.6 lbs trail weight, it provides unmatched storm stability through its aerodynamic geodesic profile. Features dual vestibules, magnetic door keepers, and waterproof taped seams rated to 3000mm hydrostatic head.",
    specs: {
      "Capacity": "2 Person",
      "Trail Weight": "1.18 kg / 2.6 lbs",
      "Floor Dimensions": "86 x 52 inches (218 x 132 cm)",
      "Peak Height": "42 inches (107 cm)",
      "Canopy Fabric": "15D Ripstop Nylon with Silicone/PU Coating",
      "Waterproof Rating": "3,000 mm HH",
      "Poles": "DAC Featherlite NSL Aluminum"
    },
    inStock: true,
    stockCount: 18,
    isFeatured: true
  },
  {
    id: "prod-2",
    name: "Sub-Zero 850-Fill Down Sleeping Bag",
    category: "sleeping",
    categoryLabel: "Sleep Systems",
    price: 289.00,
    originalPrice: 320.00,
    rating: 4.8,
    reviewCount: 96,
    badge: "Staff Pick",
    image: "assets/images/products/prod-sleeping-bag.webp",
    gallery: [
      "assets/images/products/prod-sleeping-bag.webp",
      "assets/images/sections/about-tent-view.webp"
    ],
    shortDesc: "Hydrophobic 850-fill power RDS certified goose down engineered for temperatures down to 15°F (-9°C).",
    description: "Stay toasty when the mercury plunges. The Sub-Zero sleeping bag combines ethically sourced, water-resistant down insulation with an anatomically sculpted hood and vertical chest baffles that prevent cold spots during restless nights on the trail.",
    specs: {
      "Temperature Rating": "15°F / -9°C (Comfort: 22°F)",
      "Fill Power": "850+ RDS Certified Goose Down",
      "Weight": "920 g / 2.02 lbs",
      "Shell": "Pertex Quantum 20D Recycled Nylon",
      "Pack Size": "7.5 x 13 inches compressed",
      "Zipper": "Full-length YKK anti-snag 2-way"
    },
    inStock: true,
    stockCount: 12,
    isFeatured: true
  },
  {
    id: "prod-3",
    name: "Expedition Pro 65L Hiking Backpack",
    category: "packs",
    categoryLabel: "Packs & Bags",
    price: 245.00,
    originalPrice: 280.00,
    rating: 4.9,
    reviewCount: 118,
    badge: "Top Rated",
    image: "assets/images/products/prod-backpack.webp",
    gallery: [
      "assets/images/products/prod-backpack.webp",
      "assets/images/categories/cat-packs.webp"
    ],
    shortDesc: "Ergonomic internal frame pack with customizable torso adjustment, breathable air-mesh back panel, and integrated rain cover.",
    description: "Carrying heavy multi-day loads becomes a breeze with our Expedition Pro 65L. Featuring an aluminum wishbone suspension frame that transfers weight directly to your hips, along with quick-access sleeping bag compartment and dual trekking pole attachment points.",
    specs: {
      "Volume": "65 Liters + 10L expansion",
      "Weight": "1.75 kg / 3.85 lbs",
      "Suspension": "Adjustable Aerospace Aluminum Wishbone",
      "Fabric": "420D High-Tenacity Cordura Ripstop",
      "Hydration Compatible": "Up to 3L Reservoir",
      "Rain Cover": "Included (Hi-vis reflective)"
    },
    inStock: true,
    stockCount: 24,
    isFeatured: true
  },
  {
    id: "prod-4",
    name: "Beacon 500 Lumen Solar Camping Lantern",
    category: "lighting",
    categoryLabel: "Lighting & Power",
    price: 68.00,
    originalPrice: 85.00,
    rating: 4.7,
    reviewCount: 84,
    badge: "Sale -20%",
    image: "assets/images/products/prod-lantern.webp",
    gallery: [
      "assets/images/products/prod-lantern.webp"
    ],
    shortDesc: "Warm ambient 360° light with dual USB-C solar charging, 4400mAh power bank output, and IPX6 waterproofing.",
    description: "Light up your campsite or tent with soft, glare-free illumination. The Beacon delivers up to 80 hours of runtime on low mode and can charge your phone in backcountry emergencies. Features a collapsible hanging hook and copper-accented vintage aesthetic.",
    specs: {
      "Max Output": "500 Lumens (Dimmable Warm 2700K)",
      "Battery": "4,400 mAh Li-Ion Rechargeable",
      "Charging": "Integrated High-Efficiency Solar + USB-C",
      "Runtime": "8 hrs (High) / 80 hrs (Low)",
      "Water Resistance": "IPX6 Weatherproof",
      "Weight": "310 g / 10.9 oz"
    },
    inStock: true,
    stockCount: 35,
    isFeatured: true
  },
  {
    id: "prod-5",
    name: "Vortex Titanium Micro Camp Stove",
    category: "cooking",
    categoryLabel: "Camp Cooking",
    price: 54.00,
    originalPrice: 65.00,
    rating: 4.8,
    reviewCount: 165,
    badge: "Ultralight",
    image: "assets/images/products/prod-stove.webp",
    gallery: [
      "assets/images/products/prod-stove.webp"
    ],
    shortDesc: "Featherweight 48g titanium canister stove with micro-regulating gas valve and wind-deflecting concave burner.",
    description: "Boils 1 liter of glacier water in under 3 minutes even in gusty mountain winds. Folds down smaller than a lighter to slide into your shirt pocket. Machined from aerospace-grade titanium alloy for lifetime durability.",
    specs: {
      "Weight": "48 g / 1.7 oz",
      "Output": "10,200 BTU / 3000 W",
      "Boil Time": "2 min 50 sec (1 Liter water)",
      "Fuel Compatibility": "Standard Isobutane/Propane canisters",
      "Ignition": "Manual / Micro Regulator Valve",
      "Material": "Pure Grade 2 Titanium"
    },
    inStock: true,
    stockCount: 42,
    isFeatured: true
  },
  {
    id: "prod-6",
    name: "TrailTough 32oz Insulated Thermal Flask",
    category: "cooking",
    categoryLabel: "Camp Cooking",
    price: 38.00,
    originalPrice: 45.00,
    rating: 4.9,
    reviewCount: 210,
    badge: "Essential",
    image: "assets/images/products/prod-flask.webp",
    gallery: [
      "assets/images/products/prod-flask.webp"
    ],
    shortDesc: "Double-wall vacuum insulated 18/8 food-grade stainless steel keeping drinks cold 24 hrs or hot 12 hrs.",
    description: "Built for brutal mountain conditions, the TrailTough flask features powder-coated textured grip that won't slip even with thick winter mittens. Leak-proof magnetic loop cap ensures zero spills inside your pack.",
    specs: {
      "Volume": "32 oz / 950 ml",
      "Thermal Insulation": "24h Cold / 12h Piping Hot",
      "Material": "18/8 Pro-Grade Stainless Steel",
      "Coating": "ToughGrip Powder Coat",
      "BPA Free": "100% Non-toxic & Odor-free",
      "Weight": "385 g / 13.5 oz"
    },
    inStock: true,
    stockCount: 60,
    isFeatured: true
  },
  {
    id: "prod-7",
    name: "Carbon Glide Pro Trekking Poles",
    category: "gear",
    categoryLabel: "Hiking Gear",
    price: 119.00,
    originalPrice: 140.00,
    rating: 4.8,
    reviewCount: 94,
    badge: "Field Tested",
    image: "assets/images/products/prod-poles.webp",
    gallery: [
      "assets/images/products/prod-poles.webp"
    ],
    shortDesc: "100% 3K Carbon fiber 3-section poles with ergonomic natural cork grips and secure aluminum FlickLock levers.",
    description: "Protect your knees on steep descents with our lightest poles to date. Weighing just 210g each, the Carbon Glide absorbs trail vibration while providing rock-solid stability across scree, snow, and river crossings.",
    specs: {
      "Shaft": "100% 3K Carbon Fiber",
      "Grip": "Natural Breathable Moisture-Wicking Cork",
      "Locking Mechanism": "Dual Quick-Cam Aluminum Lever",
      "Usable Length": "100 - 135 cm (Collapsed: 63 cm)",
      "Weight (Pair)": "420 g / 14.8 oz",
      "Accessories": "Mud baskets, snow baskets, carbide tips"
    },
    inStock: true,
    stockCount: 19,
    isFeatured: true
  },
  {
    id: "prod-8",
    name: "Granite Peak Waterproof Hiking Boots",
    category: "apparel",
    categoryLabel: "Apparel & Footwear",
    price: 195.00,
    originalPrice: 225.00,
    rating: 4.9,
    reviewCount: 178,
    badge: "Bestseller",
    image: "assets/images/products/prod-boots.webp",
    gallery: [
      "assets/images/products/prod-boots.webp"
    ],
    shortDesc: "Full-grain waterproof nubuck leather with breathable eVent membrane and aggressive Vibram Megagrip traction lugs.",
    description: "Designed for rough terrain and unpredictable mountain weather. The Granite Peak combines full ankle support with an EVA dual-density midsole for all-day comfort with zero break-in period required.",
    specs: {
      "Upper": "2.2mm Water-Resistant Full-Grain Nubuck",
      "Membrane": "eVent 100% Waterproof Breathable",
      "Outsole": "Vibram Megagrip with 5mm Lugs",
      "Footbed": "Ortholite Dual-Density Cushioning",
      "Weight (Pair)": "1,150 g / 2.5 lbs (Size 10)",
      "Origin": "Handcrafted in Northern Italy"
    },
    inStock: true,
    stockCount: 14,
    isFeatured: true
  },
  {
    id: "prod-9",
    name: "Wildwood Camp Hatchet & Multi-Tool",
    category: "gear",
    categoryLabel: "Hiking Gear",
    price: 79.00,
    originalPrice: 90.00,
    rating: 4.7,
    reviewCount: 62,
    badge: "Durable",
    image: "assets/images/products/prod-hatchet.webp",
    gallery: [
      "assets/images/products/prod-hatchet.webp"
    ],
    shortDesc: "High-carbon forged steel axe head with genuine American hickory handle and full-grain leather sheath.",
    description: "The essential bushcraft companion for processing firewood, driving tent stakes, and general campsite duties. Balanced weighting ensures maximum chopping power with minimal arm fatigue.",
    specs: {
      "Head Material": "1060 High-Carbon Forged Steel",
      "Handle": "Grade-A American Hickory Wood",
      "Overall Length": "14 inches (35.5 cm)",
      "Head Weight": "1.5 lbs (680 g)",
      "Sheath": "Full-Grain Saddle Leather with Belt Loop"
    },
    inStock: true,
    stockCount: 22,
    isFeatured: false
  },
  {
    id: "prod-10",
    name: "CloudRest Ultralight Camp Hammock",
    category: "tents",
    categoryLabel: "Tents & Shelter",
    price: 89.00,
    originalPrice: 105.00,
    rating: 4.8,
    reviewCount: 130,
    badge: "Comfort",
    image: "assets/images/products/prod-hammock.webp",
    gallery: [
      "assets/images/products/prod-hammock.webp"
    ],
    shortDesc: "Triple-stitched 70D parachute nylon hammock including no-stretch tree straps and wiregate carabiners.",
    description: "Sleep suspended above uneven ground, rocks, and crawling bugs. Packs down into its own integrated compression pouch. Supports up to 450 lbs comfortably with room for two.",
    specs: {
      "Capacity": "450 lbs / 204 kg",
      "Dimensions": "10 ft x 6.5 ft (300 x 200 cm)",
      "Material": "70D Diamond Ripstop Parachute Nylon",
      "Straps": "2x 10ft Tree-Friendly Poly Straps (16 Loops)",
      "Carabiners": "2x 12kN Aluminum Wiregate",
      "Total Weight": "590 g / 20.8 oz"
    },
    inStock: true,
    stockCount: 28,
    isFeatured: false
  },
  {
    id: "prod-11",
    name: "Solaris 24W Foldable Solar Trail Panel",
    category: "lighting",
    categoryLabel: "Lighting & Power",
    price: 110.00,
    originalPrice: 130.00,
    rating: 4.6,
    reviewCount: 51,
    badge: "Eco Tech",
    image: "assets/images/products/prod-solar.webp",
    gallery: [
      "assets/images/products/prod-solar.webp"
    ],
    shortDesc: "SunPower monocrystalline solar cells with smart USB-C PD 18W fast charging and weather-sealed ETFE coating.",
    description: "Keep cameras, GPS units, and satellite messengers charged on remote backcountry journeys. Clips onto your backpack with included carabiners to recharge while you hike.",
    specs: {
      "Max Power": "24 Watts Peak Output",
      "Cell Type": "SunPower Monocrystalline (24% efficiency)",
      "Ports": "1x USB-C PD 18W, 1x USB-A QC 3.0",
      "Dimensions Folded": "11 x 6.5 x 1.2 inches",
      "Weight": "490 g / 17.3 oz",
      "Durability": "IP67 Dust & Water Resistant"
    },
    inStock: true,
    stockCount: 16,
    isFeatured: false
  },
  {
    id: "prod-12",
    name: "Navigator Heritage Brass Sighting Compass",
    category: "gear",
    categoryLabel: "Hiking Gear",
    price: 49.00,
    originalPrice: 58.00,
    rating: 4.9,
    reviewCount: 88,
    badge: "Heritage",
    image: "assets/images/products/prod-compass.webp",
    gallery: [
      "assets/images/products/prod-compass.webp"
    ],
    shortDesc: "Solid machined brass sighting compass with liquid-damped jewel bearing and luminescent dial for night navigation.",
    description: "A precision navigation instrument crafted to last generations. Features declination correction scale, clinometer for slope angle measurement, and protective spring-hinged brass casing.",
    specs: {
      "Case": "Solid Machined Marine Brass",
      "Dial": "Luminescent 360° Azimuth Dial",
      "Bearing": "Liquid-Damped Sapphire Jewel",
      "Features": "Built-in Clinometer & Sighting Mirror",
      "Accuracy": "+/- 0.5 degrees",
      "Weight": "165 g / 5.8 oz"
    },
    inStock: true,
    stockCount: 31,
    isFeatured: false
  }
];

// Helper functions for catalog queries
function getAllProducts() {
  if (typeof window !== "undefined" && window.stacklyData && typeof window.stacklyData.getProducts === "function") {
    return window.stacklyData.getProducts();
  }
  try {
    const raw = localStorage.getItem("stackly_products_db_v1");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return STACKLY_PRODUCTS;
}

function getFeaturedProducts() {
  return getAllProducts().filter(p => p.isFeatured);
}

function getProductById(id) {
  return getAllProducts().find(p => p.id === id);
}

function getProductsByCategory(category) {
  if (!category || category === "all") return getAllProducts();
  return getAllProducts().filter(p => p.category === category);
}

function searchProducts(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return getAllProducts().filter(p => 
    p.name.toLowerCase().includes(q) ||
    (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
    (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
}
