const products = [
  {
    id: "headphones",
    name: "Wireless Headphones",
    category: "Audio",
    originalPrice: 4999,
    minimumPrice: 4299,
    maxDiscountPercent: 14,
    freeShipping: true,
    freeGift: "Carrying Case",
    rating: 4.8,
    sold: 2400,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
    description: "Immersive wireless sound with adaptive noise cancellation, studio-tuned drivers, and a 40-hour fast-charging battery.",
    features: [
      "Adaptive Active Noise Cancellation",
      "40-hour battery life with 10-min quick charge",
      "Multipoint Bluetooth 5.3 connectivity",
      "Ultra-plush memory foam earcups"
    ],
    specs: "Over-ear | 260g | USB-C Fast Charge | 20Hz - 20kHz",
    seller: {
      name: "Northstar Audio Labs",
      rating: 4.9,
      reviewsCount: 1420,
      verified: true,
      returnPolicy: "7-day hassle-free returns",
      shipsFrom: "Bengaluru, Karnataka",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard",
    category: "Accessories",
    originalPrice: 3499,
    minimumPrice: 2999,
    maxDiscountPercent: 15,
    freeShipping: true,
    freeGift: "Keycap Set",
    rating: 4.7,
    sold: 1800,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
    description: "Tactile mechanical switches, hot-swappable sockets, and sound-dampening silicone foam in a compact 75% layout.",
    features: [
      "Factory-lubed tactile mechanical switches",
      "Hot-swappable 5-pin PCB design",
      "Customizable per-key RGB backlighting",
      "Tri-mode: 2.4GHz wireless, Bluetooth 5.0, USB-C"
    ],
    specs: "75% Layout | 84 Keys | Aluminum Top Plate | 4000mAh",
    seller: {
      name: "KeebWorks India",
      rating: 4.8,
      reviewsCount: 890,
      verified: true,
      returnPolicy: "7-day replacement guarantee",
      shipsFrom: "Hyderabad, Telangana",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "watch",
    name: "Smart Watch",
    category: "Wearables",
    originalPrice: 6999,
    minimumPrice: 5999,
    maxDiscountPercent: 14,
    freeShipping: true,
    freeGift: "Extra Strap",
    rating: 4.6,
    sold: 3100,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    description: "Ultra-bright AMOLED always-on display with comprehensive health telemetry, standalone GPS, and 7-day endurance.",
    features: [
      "1.43-inch AMOLED Always-On Display",
      "SpO2, continuous heart-rate & sleep tracker",
      "Dual-frequency standalone GPS tracking",
      "5 ATM water resistance up to 50 meters"
    ],
    specs: "44mm Aerospace Aluminum | 48g | 7-day battery | iOS & Android",
    seller: {
      name: "Aura Wearables",
      rating: 4.7,
      reviewsCount: 2150,
      verified: true,
      returnPolicy: "7-day return & warranty",
      shipsFrom: "Mumbai, Maharashtra",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "mouse",
    name: "Gaming Mouse",
    category: "Gaming",
    originalPrice: 2499,
    minimumPrice: 2099,
    maxDiscountPercent: 16,
    freeShipping: true,
    freeGift: "Mouse Grip Tape",
    rating: 4.8,
    sold: 4200,
    badge: "Hot deal",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85",
    description: "Ultralight esports mouse engineered with optical switches, zero smoothing sensor, and flexible paracord cable.",
    features: [
      "Flawless 26,000 DPI optical sensor",
      "69g featherweight ergonomic honeycomb shell",
      "Optical switches rated for 90M clicks",
      "Six fully programmable macro buttons"
    ],
    specs: "Wired Paracord | 69g | 1000Hz Polling | PTFE Skates",
    seller: {
      name: "PixelGrid Gaming",
      rating: 4.9,
      reviewsCount: 3120,
      verified: true,
      returnPolicy: "10-day return policy",
      shipsFrom: "Bengaluru, Karnataka",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "speaker",
    name: "Bluetooth Speaker",
    category: "Audio",
    originalPrice: 3999,
    minimumPrice: 3399,
    maxDiscountPercent: 15,
    freeShipping: true,
    freeGift: "Charging Cable",
    rating: 4.7,
    sold: 1600,
    badge: "New",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
    description: "Rugged 360-degree portable speaker delivering deep dynamic bass and 18-hour continuous playtime under any weather.",
    features: [
      "True 360-degree omnidirectional sound",
      "IP67 dust and waterproof floatable build",
      "18 hours continuous battery life",
      "Wireless stereo pairing with dual speakers"
    ],
    specs: "20W RMS Output | Bluetooth 5.2 | IP67 | 540g",
    seller: {
      name: "Northstar Audio Labs",
      rating: 4.9,
      reviewsCount: 1420,
      verified: true,
      returnPolicy: "7-day hassle-free returns",
      shipsFrom: "Bengaluru, Karnataka",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "hub",
    name: "USB-C Hub",
    category: "Accessories",
    originalPrice: 1999,
    minimumPrice: 1699,
    maxDiscountPercent: 15,
    freeShipping: true,
    freeGift: "Travel Pouch",
    rating: 4.5,
    sold: 2100,
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1616578273461-3a99ce422de6?auto=format&fit=crop&w=900&q=85",
    description: "All-in-one 8-port aluminum adapter expanding your laptop with 4K HDMI, Gigabit Ethernet, and 100W Power Delivery.",
    features: [
      "Crystal-clear 4K @ 60Hz HDMI video output",
      "100W USB-C Power Delivery pass-through",
      "High-speed SD / MicroSD card readers (UHS-I)",
      "Anodized heat-dissipating aluminum chassis"
    ],
    specs: "8-in-1 Ports | 100W PD | USB 3.2 Gen 1 | 82g",
    seller: {
      name: "Apex Electronics",
      rating: 4.6,
      reviewsCount: 940,
      verified: true,
      returnPolicy: "7-day return policy",
      shipsFrom: "New Delhi, Delhi",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "webcam",
    name: "Webcam",
    category: "Electronics",
    originalPrice: 2999,
    minimumPrice: 2549,
    maxDiscountPercent: 15,
    freeShipping: true,
    freeGift: "Privacy Cover",
    rating: 4.4,
    sold: 980,
    badge: "Work ready",
    image: "https://images.unsplash.com/photo-1762681290673-ba1ad4ea0875?auto=format&fit=crop&w=900&q=85",
    description: "Professional 1080p stream webcam with intelligent light correction, dual stereo noise-cancelling mics, and physical privacy slider.",
    features: [
      "1080p Full HD at smooth 60fps",
      "Dual omnidirectional noise-filtering mics",
      "Low-light HDR auto-exposure optimization",
      "Built-in mechanical privacy shutter"
    ],
    specs: "1080p/60fps | 90° FOV | Plug & Play USB-A/C | Tripod Mount",
    seller: {
      name: "Apex Electronics",
      rating: 4.6,
      reviewsCount: 940,
      verified: true,
      returnPolicy: "7-day return policy",
      shipsFrom: "New Delhi, Delhi",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  },
  {
    id: "power-bank",
    name: "Power Bank",
    category: "Electronics",
    originalPrice: 1799,
    minimumPrice: 1529,
    maxDiscountPercent: 15,
    freeShipping: true,
    freeGift: "Cable Organizer",
    rating: 4.6,
    sold: 3700,
    badge: "Best value",
    image: "https://images.unsplash.com/photo-1657653465536-f63b4da66f93?auto=format&fit=crop&w=900&q=85",
    description: "Compact 20,000mAh battery pack featuring 22.5W fast bidirectional charging and a smart real-time numeric LED display.",
    features: [
      "High-density 20,000mAh Li-polymer cell",
      "22.5W PD 3.0 & QC 4.0 fast charging",
      "Real-time digital LED battery percentage",
      "Multi-device triple output charging"
    ],
    specs: "20,000mAh | 22.5W Max | USB-C In/Out + 2x USB-A | 385g",
    seller: {
      name: "VoltCore Gear",
      rating: 4.8,
      reviewsCount: 1820,
      verified: true,
      returnPolicy: "7-day return policy",
      shipsFrom: "Pune, Maharashtra",
      responseTime: "< 2 mins (AI DealPilot)"
    }
  }
];

function getProduct(productId) {
  return products.find(product => product.id === productId);
}

function toPublicProduct(product) {
  if (!product) return null;
  // Keep minimumPrice and maxDiscountPercent strictly private (merchant rules)
  const { minimumPrice, maxDiscountPercent, freeShipping, freeGift, ...publicProduct } = product;
  return {
    ...publicProduct,
    price: product.originalPrice,
    originalPrice: product.originalPrice,
    freeShippingAvailable: Boolean(freeShipping),
    giftAvailable: Boolean(freeGift),
    authorizedGift: freeGift || null
  };
}

module.exports = { products, getProduct, toPublicProduct };
