const mongoose = require("mongoose");
module.exports = mongoose.model("Lead", new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist" },
  name: String, email: String, source: String, status: { type: String, default: "New" }
}));
