const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  status: { type: String, default: "Active" },
  tags: { type: [String], default: [] },
  intake: {
    presentingConcern: String,
    history: String,
    consent: Boolean,
    consentAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Client", clientSchema);
