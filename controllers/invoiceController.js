// controllers/invoiceController.js
const {
    generateInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
  } = require("../services/invoiceService");
  
  const invoiceTemplate = require("../utils/invoiceTemplate");
  const generatePDF = require("../utils/pdfGenerator");
  const path = require("path");
  const fs = require("fs");
  
  // CREATE + PDF Download
async function createInvoice(req, res) {
  try {
    const { bookingId, companyKey } = req.params;
    const { invoice, trip, company } = await generateInvoice({
      bookingId,
      companyKey,
      createdBy: req.user._id,
    });

    const html = invoiceTemplate({ invoice, trip, company });
    const pdfBuffer = await generatePDF(html);

    // ✅ Send PDF directly to client (no saving to disk)
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`,
    });
    res.end(pdfBuffer, "binary");

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// controllers/invoiceController.js
async function downloadInvoice(req, res) {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const company = await Company.findById(invoice.companyId);
    const trip = await Trip.findById(invoice.tripId);

    const html = invoiceTemplate({ invoice, trip, company });
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${invoice.invoiceNumber}.pdf`,
    });
    res.end(pdfBuffer, "binary");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


  // READ all
  async function listInvoices(req, res) {
    try {
      const invoices = await getInvoices();
      res.json(invoices);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  // READ single
  async function getInvoice(req, res) {
    try {
      const invoice = await getInvoiceById(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      res.json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  // UPDATE
  async function editInvoice(req, res) {
    try {
      const invoice = await updateInvoice(req.params.id, req.body);
      res.json(invoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  // DELETE
  async function removeInvoice(req, res) {
    try {
      const invoice = await deleteInvoice(req.params.id);
      res.json({ message: "Invoice deleted", invoice });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  
  module.exports = {
    createInvoice,
    downloadInvoice,
    listInvoices,
    getInvoice,
    editInvoice,
    removeInvoice,
  };
  