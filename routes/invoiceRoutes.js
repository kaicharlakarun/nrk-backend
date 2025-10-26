// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  createInvoice,
  downloadInvoice,
  listInvoices,
  getInvoice,
  editInvoice,
  removeInvoice,
} = require("../controllers/invoiceController");

// CREATE invoice + download PDF
router.get("/:bookingId/:companyKey", authMiddleware, createInvoice);

// CRUD
router.get("/:id/pdf", authMiddleware, downloadInvoice);
router.get("/", authMiddleware, listInvoices);       // List all
router.get("/:id", authMiddleware, getInvoice);      // Get one
router.put("/:id", authMiddleware, editInvoice);     // Update
router.delete("/:id", authMiddleware, removeInvoice); // Delete

module.exports = router;
