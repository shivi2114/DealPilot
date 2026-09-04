require("dotenv").config();
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
app.get("/", (req, res) => res.json({ success: true, message: "DealPilot backend is running" }));
app.use("/api/products", productRoutes);
app.use("/api", negotiationRoutes);
app.use("/api", paymentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use((req, res) => res.status(404).json({ success: false, error: "Route not found" }));
app.use((error, req, res, next) => { console.error("Request error:", error.stack || error.message); if (res.headersSent) return next(error); res.status(error.status || 500).json({ success: false, error: error.status ? error.message : "Internal server error" }); });

const PORT = Number(process.env.PORT) || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`DealPilot backend running on http://localhost:${PORT}`));
module.exports = app;
