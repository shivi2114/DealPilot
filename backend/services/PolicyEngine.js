function counterOffer(product) {
  const target = product.originalPrice * (1 - product.maxDiscountPercent / 100);
  return Math.max(product.minimumPrice, Math.ceil(target / 100) * 100 - 1);
}
function validateOffer(offer, product) {
  const base = { allowed: false, offerPrice: product.originalPrice, freeShipping: false, freeGift: null, reason: "Offer rejected" };
  if (!offer || !product) return { ...base, reason: "Product or offer is missing" };
  if (typeof offer.offerPrice !== "number" || !Number.isFinite(offer.offerPrice)) return { ...base, offerPrice: counterOffer(product), reason: "Offer price is invalid" };
  const price = Math.round(offer.offerPrice);
  const discount = ((product.originalPrice - price) / product.originalPrice) * 100;
  if (price < product.minimumPrice) return { ...base, offerPrice: counterOffer(product), freeShipping: product.freeShipping, reason: "Offer below merchant minimum" };
  if (price > product.originalPrice) return { ...base, reason: "Offer above original price" };
  if (discount > product.maxDiscountPercent) return { ...base, offerPrice: counterOffer(product), reason: "Discount exceeds merchant policy" };
  if (offer.freeShipping === true && !product.freeShipping) return { ...base, offerPrice: price, reason: "Free shipping is not authorized" };
  if (offer.freeGift && offer.freeGift !== product.freeGift) return { ...base, offerPrice: price, freeShipping: Boolean(offer.freeShipping && product.freeShipping), reason: "Gift is not authorized" };
  return { allowed: true, offerPrice: price, freeShipping: Boolean(offer.freeShipping && product.freeShipping), freeGift: offer.freeGift || null, reason: "Offer satisfies all merchant rules" };
}
module.exports = { validateOffer, counterOffer };
