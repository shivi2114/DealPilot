require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { ensureStorage } = require("./services/storageService");
const productRoutes = require("./routes/productRoutes");
const negotiationRoutes = require("./routes/negotiationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const auditRoutes = require("./routes/auditRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
ensureStorage();
app.use(cors());
app.use("/api/payment/webhook", express.raw({ type: "application/json", limit: "100kb" }));
app.use(express.json({ limit: "100kb" }));

// API health endpoint
app.get("/api/health", (req, res) => res.json({ success: true, message: "DealPilot backend is running" }));

// Core API routes
app.use("/api/products", productRoutes);
app.use("/api", negotiationRoutes);
app.use("/api", paymentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/analytics", analyticsRoutes);

// In production or when frontend/dist is built, serve React static build
const distPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback (no '*' string to avoid path-to-regexp error)
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => res.json({ success: true, message: "DealPilot backend is running" }));
}

// 404 handler for unmatched routes
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, error: "API route not found" });
  }
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Request error:", error.stack || error.message);
  if (res.headersSent) return next(error);
  res.status(error.status || 500).json({ success: false, error: error.status ? error.message : "Internal server error" });
});

const PORT = Number(process.env.PORT) || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`DealPilot running on http://localhost:${PORT}`));
module.exports = app;
