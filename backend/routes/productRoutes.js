const express = require("express");
const { products, getProduct, toPublicProduct } = require("../data/products");
const router = express.Router();
router.get("/", (req, res) => res.json(products.map(toPublicProduct)));
router.get("/:id", (req, res) => { const product = getProduct(req.params.id); if (!product) return res.status(404).json({ success: false, error: "Product not found" }); res.json(toPublicProduct(product)); });
module.exports = router;
