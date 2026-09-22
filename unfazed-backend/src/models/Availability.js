const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  duration: { type: Number, default: 60 },
  blocked: { type: Boolean, default: false }
});

module.exports = mongoose.model("Availability", schema);
