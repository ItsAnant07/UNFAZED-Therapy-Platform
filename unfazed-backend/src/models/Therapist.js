const mongoose = require("mongoose");

const therapistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  bio: { type: String, default: "" },
  specializations: { type: [String], default: [] },
  languages: { type: [String], default: ["English"] },
  tier: { type: String, default: "Starter" },
  upiId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Therapist", therapistSchema);
