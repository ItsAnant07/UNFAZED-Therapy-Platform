const Therapist = require("../models/Therapist");
const { getEntitlements } = require("../services/entitlementService");

exports.me = async (req, res) => {
  const therapist = await Therapist.findById(req.therapist._id).select("-password_hash");
  res.json({ therapist });
};

exports.update = async (req, res, next) => {
  try {
    const allowed = ["name", "bio", "specializations", "languages", "upiId"];
    allowed.forEach(k => { if (req.body[k] !== undefined) req.therapist[k] = req.body[k]; });
    await req.therapist.save();
    res.json({ therapist: req.therapist });
  } catch (e) { next(e); }
};

exports.publicList = async (req, res, next) => {
  try {
    const therapists = await Therapist.find({}).select("-password_hash").sort({ name: 1 });
    res.json({ therapists });
  } catch (e) { next(e); }
};

exports.publicProfile = async (req, res, next) => {
  try {
    const therapist = await Therapist.findOne({ slug: req.params.slug }).select("-password_hash");
    if (!therapist) return res.status(404).json({ message: "Therapist not found" });
    res.json({ therapist });
  } catch (e) { next(e); }
};

exports.entitlements = async (req, res, next) => {
  try { res.json({ entitlements: await getEntitlements(req.therapist._id) }); }
  catch (e) { next(e); }
};
