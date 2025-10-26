const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Company = require("../models/Company");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// ================= CREATE COMPANY =================
// Admin only
router.post(
  "/",
  authMiddleware,
  adminOnly,
  [
    body("key").notEmpty().withMessage("Company key is required"),
    body("name").notEmpty().withMessage("Company name is required"),
    body("mobile")
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\+?[0-9]{10,15}$/)
      .withMessage("Valid mobile number required"),
    body("gst")
      .optional()
      .isLength({ min: 15, max: 15 })
      .withMessage("GST must be 15 characters long"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Valid website URL required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { key } = req.body;
      if (await Company.findOne({ key, isDeleted: false })) {
        return res.status(400).json({ message: "Company key already exists" });
      }

      const company = new Company({
        ...req.body,
        createdBy: req.user.id,
      });

      await company.save();
      res.status(201).json(company);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ================= GET ALL COMPANIES =================
// Admin only
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const companies = await Company.find({ isDeleted: false }).sort({ createdAt: -1 });
    const total = await Company.countDocuments({ isDeleted: false });
    res.json({ total, companies });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= GET SINGLE COMPANY =================
router.get("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, isDeleted: false });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ================= UPDATE COMPANY =================
// Admin only
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  [
    body("name").optional().notEmpty().withMessage("Company name cannot be empty"),
    body("mobile")
      .optional()
      .matches(/^\+?[0-9]{10,15}$/)
      .withMessage("Valid mobile number required"),
    body("gst")
      .optional()
      .isLength({ min: 15, max: 15 })
      .withMessage("GST must be 15 characters long"),
    body("website").optional().isURL().withMessage("Valid website URL required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const company = await Company.findOne({ _id: req.params.id, isDeleted: false });
      if (!company) return res.status(404).json({ message: "Company not found" });

      const updates = { ...req.body, updatedBy: req.user.id };
      Object.keys(updates).forEach((field) => {
        if (updates[field] !== undefined) company[field] = updates[field];
      });

      await company.save();
      res.json(company);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Duplicate company key" });
      }
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// ================= DELETE COMPANY =================
// Admin only (Soft delete)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, isDeleted: false });
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.isDeleted = true;
    company.deletedAt = new Date();
    company.updatedBy = req.user.id;
    await company.save();

    res.json({ message: "Company deleted (soft)" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;