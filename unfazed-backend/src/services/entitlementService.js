const Therapist = require("../models/Therapist");
const SubscriptionTierConfig = require("../models/SubscriptionTierConfig");

async function canAccess(therapistId, featureKey) {
  const therapist = await Therapist.findById(therapistId);
  if (!therapist) return false;
  const config = await SubscriptionTierConfig.findOne({ name: therapist.tier });
  if (!config) return false;
  return Boolean(config.features?.[featureKey]);
}

async function getEntitlements(therapistId) {
  const therapist = await Therapist.findById(therapistId);
  if (!therapist) return null;
  return SubscriptionTierConfig.findOne({ name: therapist.tier });
}

module.exports = { canAccess, getEntitlements };
