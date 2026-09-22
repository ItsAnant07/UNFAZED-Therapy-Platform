const Client = require("../models/Client");

exports.list = async (req, res, next) => {
  try {
    const clients = await Client.find({ therapist: req.therapist._id }).sort({ createdAt: -1 });
    res.json({ clients });
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const client = await Client.create({ ...req.body, therapist: req.therapist._id });
    res.status(201).json({ client });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, therapist: req.therapist._id },
      req.body, { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ client });
  } catch (e) { next(e); }
};

exports.publicIntake = async (req, res, next) => {
  try {
    const client = await Client.create({
      therapist: req.params.therapistId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      intake: {
        presentingConcern: req.body.presentingConcern,
        history: req.body.history,
        consent: Boolean(req.body.consent),
        consentAt: req.body.consent ? new Date() : null
      }
    });
    res.status(201).json({ client });
  } catch (e) { next(e); }
};
