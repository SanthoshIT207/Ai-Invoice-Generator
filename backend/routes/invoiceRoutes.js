const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController.js");
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Existing routes
router
  .route("/")
  .post(protect, createInvoice)
  .get(protect, getInvoices)
  .put((req, res) => {  
    // <<=== NEW: If PUT /api/invoices (no :id) is called, show JSON error
    return res.status(404).json({ message: "Invoice not found" });
  });

router
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;
