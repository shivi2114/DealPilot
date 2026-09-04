const express = require("express");
const { recentAudit } = require("../services/auditService");
const router = express.Router();
router.get("/", (req, res) => res.json({ success: true, events: recentAudit(req.query.productId, req.query.limit) }));
module.exports = router;
