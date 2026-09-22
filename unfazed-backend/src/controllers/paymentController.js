const Payment = require("../models/Payment");
const Session = require("../models/Session");

exports.create = async (req, res, next) => {
  try {
    const { clientId, amount } = req.body;
    const payment = await Payment.create({
      therapist: req.therapist._id, client: clientId, amount, method: "Gateway",
      platform_fee: Number(amount || 0) * 0.02, net_amount: Number(amount || 0) * 0.98,
      status: "paid", gateway_transaction_id: `DEMO_${Date.now()}`
    });
    res.status(201).json({ payment, message: "Demo payment recorded" });
  } catch (e) { next(e); }
};

exports.list = async (req, res, next) => {
  try {
    res.json({ payments: await Payment.find({ therapist: req.therapist._id }).populate("client", "name").populate("session", "start end status").sort({ createdAt: -1 }) });
  } catch (e) { next(e); }
};

exports.publicDetails = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.sessionId).populate("therapist", "name slug upiId").populate("client", "name email phone");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session, upiId: session.therapist?.upiId || process.env.UPI_ID || "" });
  } catch (e) { next(e); }
};

exports.publicUpi = async (req, res, next) => {
  try {
    const { email, utr = "" } = req.body;
    const session = await Session.findById(req.params.sessionId).populate("therapist", "name upiId").populate("client", "name email");
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (String(session.client?.email || "").toLowerCase() !== String(email || "").toLowerCase().trim()) return res.status(403).json({ message: "Email does not match this booking" });
    if (session.status !== "Booked") return res.status(400).json({ message: "This session is not available for payment" });
    const existing = await Payment.findOne({ session: session._id, status: { $in: ["pending", "paid"] } });
    if (existing) return res.json({ success: true, payment: existing, message: "Payment is already recorded for this session" });
    const payment = await Payment.create({ therapist: session.therapist._id, client: session.client._id, session: session._id, amount: session.amount, method: "UPI", utr: String(utr).trim(), status: "pending", platform_fee: Number(session.amount || 0) * 0.02, net_amount: Number(session.amount || 0) * 0.98 });
    res.status(201).json({ success: true, payment, message: "Payment marked as pending verification" });
  } catch (e) { next(e); }
};


exports.refund = async (req, res, next) => {
  try {
    const { refundReference = "" } = req.body;
    if (!String(refundReference).trim()) return res.status(400).json({ message: "Enter the refund UTR/reference after sending the refund" });
    const payment = await Payment.findOne({ _id: req.params.paymentId, therapist: req.therapist._id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.refund_status !== "pending") return res.status(400).json({ message: "This payment is not awaiting a refund" });
    payment.refund_status = "refunded";
    payment.status = "refunded";
    payment.refund_reference = String(refundReference).trim();
    payment.refundedAt = new Date();
    await payment.save();
    res.json({ success: true, payment, message: "Refund recorded successfully" });
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["paid", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid payment status" });
    const payment = await Payment.findOne({ _id: req.params.paymentId, therapist: req.therapist._id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    payment.status = status;
    await payment.save();
    res.json({ success: true, payment });
  } catch (e) { next(e); }
};
