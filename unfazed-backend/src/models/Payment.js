const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  amount: Number,
  method: { type: String, enum: ["UPI", "Cash", "Gateway"], default: "UPI" },
  utr: String,
  gateway_transaction_id: String,
  platform_fee: Number,
  net_amount: Number,
  status: { type: String, enum: ["pending", "paid", "rejected", "refunded"], default: "pending" },
  refund_status: { type: String, enum: ["none", "pending", "refunded"], default: "none" },
  refund_amount: { type: Number, default: 0 },
  refund_reference: String,
  refundedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", schema);
