const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, unique: true },
  monthlyPrice: Number,
  caps: { activeClients: Number },
  features: {
    sharedNotes: Boolean,
    advancedAnalytics: Boolean,
    chat: Boolean,
    packages: Boolean
  }
});

module.exports = mongoose.model("SubscriptionTierConfig", schema);
