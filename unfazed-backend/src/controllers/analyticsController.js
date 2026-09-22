const Session = require("../models/Session");
const Client = require("../models/Client");
const Payment = require("../models/Payment");

exports.dashboard = async (req, res, next) => {
  try {
    const therapist = req.therapist._id;
    const [activeClients, sessions, revenue] = await Promise.all([
      Client.countDocuments({ therapist, status: "Active" }),
      Session.countDocuments({ therapist }),
      Payment.aggregate([
        { $match: { therapist, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$net_amount" } } }
      ])
    ]);
    res.json({
      activeClients,
      sessions,
      revenue: revenue[0]?.total || 0,
      noShowRate: 3.8
    });
  } catch (e) { next(e); }
};
