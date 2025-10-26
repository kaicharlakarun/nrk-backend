// services/invoiceService.js
const Trip = require("../models/trips");
const Company = require("../models/Company");
const Invoice = require("../models/Invoice");

// CREATE Invoice
async function generateInvoice({ bookingId, companyKey, createdBy }) {
  const trip = await Trip.findOne({ bookingId });
  if (!trip) throw new Error("Trip not found");

  const company = await Company.findOne({ key: companyKey, isDeleted: false });
  if (!company) throw new Error("Company not found");

  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  const seq = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.replace("INV", "")) + 1
    : 1;
  const invoiceNumber = `INV${seq.toString().padStart(6, "0")}`;

  const invoice = new Invoice({
    invoiceNumber,
    tripId: trip._id,
    bookingId: trip.bookingId,
    companyId: company._id,
    amount: trip.tripAmount,
    totalExpenses: trip.totalExpenses,
    profit: trip.profit,
    createdBy,
  });

  await invoice.save();
  return { invoice, trip, company };
}

// READ (all)
async function getInvoices() {
  return Invoice.find().populate("tripId companyId createdBy");
}

// READ (single)
async function getInvoiceById(id) {
  return Invoice.findById(id).populate("tripId companyId createdBy");
}

// UPDATE
async function updateInvoice(id, updates) {
  const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true });
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
}

// DELETE
async function deleteInvoice(id) {
  const invoice = await Invoice.findByIdAndDelete(id);
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
}

module.exports = {
  generateInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
