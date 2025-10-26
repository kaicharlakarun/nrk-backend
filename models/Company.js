// models/Company.js
const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  modeOfPayment: { type: String },
  holder: { type: String },
  branchAddress: { type: String },
  bankName: { type: String },
  currentAccount: { type: String },
  ifsc: { type: String },
});

const companySchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true, index: true }, // e.g. "bshtravels"
    name: { type: String, required: true },
    address: { type: String },
    website: { type: String },
    gst: { type: String },
    mobile: { type: String },
    logo: { type: String },
    stamp: { type: String },
    description: { type: String },
    bank: bankSchema,

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
  },
  { timestamps: true }
);

// Soft delete filter (optional)
companySchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

module.exports = mongoose.model("Company", companySchema);
