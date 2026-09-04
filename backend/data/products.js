const products = [
  { id: "headphones", name: "Wireless Headphones", category: "Audio", originalPrice: 4999, minimumPrice: 4299, maxDiscountPercent: 14, freeShipping: true, freeGift: "Carrying Case", rating: 4.8, sold: 2400, description: "Premium wireless headphones with 40-hour battery life." },
  { id: "keyboard", name: "Mechanical Keyboard", category: "Accessories", originalPrice: 3499, minimumPrice: 2999, maxDiscountPercent: 15, freeShipping: true, freeGift: "Keycap Set", rating: 4.7, sold: 1800, description: "RGB mechanical keyboard with tactile switches." },
  { id: "watch", name: "Smart Watch", category: "Wearables", originalPrice: 6999, minimumPrice: 5999, maxDiscountPercent: 14, freeShipping: true, freeGift: "Extra Strap", rating: 4.6, sold: 3100, description: "Fitness tracking with smart notifications." },
  { id: "mouse", name: "Gaming Mouse", category: "Gaming", originalPrice: 2499, minimumPrice: 2099, maxDiscountPercent: 16, freeShipping: true, freeGift: "Mouse Grip Tape", rating: 4.8, sold: 4200, description: "Lightweight precision gaming mouse." },
  { id: "speaker", name: "Bluetooth Speaker", category: "Audio", originalPrice: 3999, minimumPrice: 3399, maxDiscountPercent: 15, freeShipping: true, freeGift: "Charging Cable", rating: 4.7, sold: 1600, description: "Portable speaker with room-filling sound." },
  { id: "hub", name: "USB-C Hub", category: "Accessories", originalPrice: 1999, minimumPrice: 1699, maxDiscountPercent: 15, freeShipping: true, freeGift: "Travel Pouch", rating: 4.5, sold: 2100, description: "Eight-in-one connectivity for modern workstations." },
  { id: "webcam", name: "Webcam", category: "Electronics", originalPrice: 2999, minimumPrice: 2549, maxDiscountPercent: 15, freeShipping: true, freeGift: "Privacy Cover", rating: 4.4, sold: 980, description: "Full HD webcam for calls and streaming." },
  { id: "power-bank", name: "Power Bank", category: "Electronics", originalPrice: 1799, minimumPrice: 1529, maxDiscountPercent: 15, freeShipping: true, freeGift: "Cable Organizer", rating: 4.6, sold: 3700, description: "High-capacity portable power with fast charging." }
];

function getProduct(productId) { return products.find(product => product.id === productId); }
function toPublicProduct(product) {
  if (!product) return null;
  const { minimumPrice, maxDiscountPercent, freeShipping, freeGift, ...publicProduct } = product;
  return { ...publicProduct, freeShippingAvailable: freeShipping, giftAvailable: Boolean(freeGift) };
}

module.exports = { products, getProduct, toPublicProduct };
