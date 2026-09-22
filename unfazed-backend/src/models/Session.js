const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  bookingCode: { type: String, unique: true, index: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, enum: ["Booked", "Completed", "Cancelled"], default: "Booked" },
  cancellationReason: { type: String, default: "" },
  cancelledBy: { type: String, enum: ["Client", "Therapist", "System", ""], default: "" },
  cancelledAt: Date,
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
