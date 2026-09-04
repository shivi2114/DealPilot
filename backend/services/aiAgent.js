const { GoogleGenAI } = require("@google/genai");

async function negotiate(customerMessage, product) {
  if (!process.env.GEMINI_API_KEY) return fallback(product, "AI configuration is unavailable, so here is a safe merchant-approved offer.");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are DealPilot, a concise AI commerce negotiator. AI proposes only; a deterministic policy engine decides. Never claim customer acceptance or payment success. Never invent benefits. Product: ${product.name}, category: ${product.category}, original price: ₹${product.originalPrice}. Private rules: minimum price ₹${product.minimumPrice}, max discount ${product.maxDiscountPercent}%, free shipping authorized: ${product.freeShipping}, authorized gift: ${product.freeGift || "none"}. Customer message: ${customerMessage}. Return only JSON with offerPrice number, freeShipping boolean, freeGift string or null, message string. Respect all rules.`;
  try {
    const response = await ai.models.generateContent({ model: "gemini-3.6-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: "object", properties: { offerPrice: { type: "number" }, freeShipping: { type: "boolean" }, freeGift: { type: "string", nullable: true }, message: { type: "string" } }, required: ["offerPrice", "freeShipping", "freeGift", "message"] } } });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini negotiation error:", error.message);
    return fallback(product, "I could not reach the negotiation service, so I can still offer this safe price.");
  }
}
function fallback(product, message) { return { offerPrice: product.originalPrice, freeShipping: false, freeGift: null, message }; }
module.exports = negotiate;
