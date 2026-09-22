const mongoose = require("mongoose");
module.exports = mongoose.model("Package", new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist" },
  name: String, sessions: Number, price: Number, expiryDays: Number
}));
