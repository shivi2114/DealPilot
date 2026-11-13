const { GoogleGenAI } = require("@google/genai");

function smartRuleProposal(customerMessage, product) {
  const text = (customerMessage || "").toLowerCase().trim();
  const maxDiscountRatio = (product.maxDiscountPercent || 15) / 100;
  const bestAllowedPrice = Math.max(product.minimumPrice, Math.round(product.originalPrice * (1 - maxDiscountRatio)));

  // 1. Check if user typed a specific number / bid
  const numberMatches = text.match(/(?:₹|rs\.?|inr)?\s*([0-9]{3,6})/i);
  if (numberMatches) {
    const userBid = parseInt(numberMatches[1], 10);
    if (userBid >= bestAllowedPrice && userBid <= product.originalPrice) {
      return {
        offerPrice: userBid,
        freeShipping: Boolean(product.freeShipping),
        freeGift: product.freeGift || null,
        message: `I can accept your offer of ₹${userBid.toLocaleString('en-IN')}${product.freeShipping ? ' with free shipping' : ''}${product.freeGift ? ` and an included ${product.freeGift}` : ''}. Deal approved!`
      };
    } else if (userBid < bestAllowedPrice) {
      // Counter-propose the merchant floor
      return {
        offerPrice: bestAllowedPrice,
        freeShipping: Boolean(product.freeShipping),
        freeGift: product.freeGift || null,
        message: `₹${userBid.toLocaleString('en-IN')} is below our merchant floor for ${product.name}. However, I can offer our lowest allowable price of ₹${bestAllowedPrice.toLocaleString('en-IN')}${product.freeShipping ? ' with free shipping' : ''}${product.freeGift ? ` and a complimentary ${product.freeGift}` : ''}.`
      };
    }
  }

  // 2. Best price request
  if (text.includes("best") || text.includes("lowest") || text.includes("cheapest")) {
    return {
      offerPrice: bestAllowedPrice,
      freeShipping: Boolean(product.freeShipping),
      freeGift: product.freeGift || null,
      message: `Here is our best deal on ${product.name}: ₹${bestAllowedPrice.toLocaleString('en-IN')} (${product.maxDiscountPercent}% off)${product.freeShipping ? ' with free delivery' : ''}${product.freeGift ? ` plus a complimentary ${product.freeGift}` : ''}.`
    };
  }

  // 3. Free shipping request
  if (text.includes("shipping") || text.includes("delivery")) {
    const discount = Math.round(product.originalPrice * 0.95);
    const offerPrice = Math.max(product.minimumPrice, discount);
    return {
      offerPrice,
      freeShipping: true,
      freeGift: null,
      message: `I've approved free standard shipping for your order, and reduced the price to ₹${offerPrice.toLocaleString('en-IN')}!`
    };
  }

  // 4. Free gift / perk request
  if (text.includes("gift") || text.includes("bundle") || text.includes("case") || text.includes("strap")) {
    const discount = Math.round(product.originalPrice * 0.93);
    const offerPrice = Math.max(product.minimumPrice, discount);
    return {
      offerPrice,
      freeShipping: Boolean(product.freeShipping),
      freeGift: product.freeGift || "Accessory Perk",
      message: product.freeGift
        ? `Deal approved! I can offer ₹${offerPrice.toLocaleString('en-IN')} and include a complimentary ${product.freeGift}!`
        : `I can offer ₹${offerPrice.toLocaleString('en-IN')} with our priority perks bundle!`
    };
  }

  // 5. General discount / greeting
  const moderatePrice = Math.max(product.minimumPrice, Math.round(product.originalPrice * (1 - (maxDiscountRatio * 0.75))));
  return {
    offerPrice: moderatePrice,
    freeShipping: Boolean(product.freeShipping),
    freeGift: product.freeGift || null,
    message: `I'd love to help! I can offer ${product.name} at a negotiated price of ₹${moderatePrice.toLocaleString('en-IN')}${product.freeShipping ? ' with free delivery' : ''}${product.freeGift ? ` and a complimentary ${product.freeGift}` : ''}.`
  };
}

async function negotiate(customerMessage, product) {
  if (!process.env.GEMINI_API_KEY) {
    return smartRuleProposal(customerMessage, product);
  }

  const prompt = `You are DealPilot, a concise AI commerce negotiator representing the seller. You negotiate fair prices with buyers while respecting merchant guardrails.
Product: ${product.name} (${product.category})
Original List Price: ₹${product.originalPrice}
Merchant Guardrails (Confidential):
- Minimum allowed price: ₹${product.minimumPrice}
- Maximum discount: ${product.maxDiscountPercent}%
- Free shipping authorized: ${Boolean(product.freeShipping)}
- Free gift authorized: ${product.freeGift || "None"}

Customer Message: "${customerMessage}"

Return ONLY valid JSON matching this schema:
{
  "offerPrice": number,
  "freeShipping": boolean,
  "freeGift": string or null,
  "message": string
}
Rules:
- offerPrice MUST be an integer between ${product.minimumPrice} and ${product.originalPrice}.
- freeShipping can only be true if authorized.
- freeGift can only be "${product.freeGift || ""}" if authorized, otherwise null.
- Keep the message polite, professional, and clear about the proposed price in INR.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            offerPrice: { type: "number" },
            freeShipping: { type: "boolean" },
            freeGift: { type: "string", nullable: true },
            message: { type: "string" }
          },
          required: ["offerPrice", "freeShipping", "freeGift", "message"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (error) {
    // If Gemini API is unreachable (sandbox network restriction or API rate limit), use smart bargaining fallback
    return smartRuleProposal(customerMessage, product);
  }
}

module.exports = negotiate;
