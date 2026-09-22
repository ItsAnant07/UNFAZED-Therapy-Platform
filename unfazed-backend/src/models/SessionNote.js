const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist", required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  type: { type: String, enum: ["private", "shared"], default: "private" },
  title: { type: String, default: "Session Note" },
  content: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SessionNote", noteSchema);
