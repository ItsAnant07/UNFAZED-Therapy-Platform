const SessionNote = require("../models/SessionNote");
const { canAccess } = require("../services/entitlementService");

exports.list = async (req, res, next) => {
  try {
    const notes = await SessionNote.find({ therapist: req.therapist._id }).populate("client", "name").sort({ createdAt: -1 });
    res.json({ notes });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    if (req.body.type === "shared" && !(await canAccess(req.therapist._id, "sharedNotes")))
      return res.status(403).json({ message: "Shared notes require an eligible plan" });
    const note = await SessionNote.create({ ...req.body, therapist: req.therapist._id });
    res.status(201).json({ note });
  } catch (e) { next(e); }
};

exports.clientShared = async (req, res, next) => {
  try {
    const notes = await SessionNote.find({
      client: req.params.clientId,
      type: "shared"
    }).select("title content createdAt");
    res.json({ notes });
  } catch (e) { next(e); }
};
