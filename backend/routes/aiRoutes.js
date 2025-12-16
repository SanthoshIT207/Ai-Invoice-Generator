const express = require("express");
const{ parseInvoiceFromText, generateReminderEmail, getDashboardSummary } = require("../controllers/aiController.js");
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-remainder", protect, generateReminderEmail);
router.get("/dashboard-summary", protect, getDashboardSummary);

module.exports = router;