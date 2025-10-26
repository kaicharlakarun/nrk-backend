// models/Invoice.js
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true }, // e.g. INV20250001
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    bookingId: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },

    amount: { type: Number, required: true },
    totalExpenses: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },

    notes: String,

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
