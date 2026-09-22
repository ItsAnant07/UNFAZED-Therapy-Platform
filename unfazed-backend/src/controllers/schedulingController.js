const Session = require("../models/Session");
const Client = require("../models/Client");
const Availability = require("../models/Availability");
const Therapist = require("../models/Therapist");
const Payment = require("../models/Payment");
const { sendBookingConfirmation } = require("../services/notificationService");

function bookingCode() {
  return `UF-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

async function uniqueBookingCode() {
  let code;
  do { code = bookingCode(); } while (await Session.exists({ bookingCode: code }));
  return code;
}

exports.availability = async (req, res, next) => {
  try {
    const items = await Availability.find({ therapist: req.therapist._id });
    res.json({ availability: items });
  } catch (e) { next(e); }
};

exports.setAvailability = async (req, res, next) => {
  try {
    const item = await Availability.create({ ...req.body, therapist: req.therapist._id });
    res.status(201).json({ availability: item });
  } catch (e) { next(e); }
};

exports.sessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ therapist: req.therapist._id }).populate("client", "name email phone").sort({ start: 1 });
    const payments = await Payment.find({ therapist: req.therapist._id });
    const paymentBySession = new Map(payments.filter(p => p.session).map(p => [String(p.session), p]));
    res.json({ sessions: sessions.map(s => ({ ...s.toObject(), payment: paymentBySession.get(String(s._id)) || null })) });
  } catch (e) { next(e); }
};

exports.book = async (req, res, next) => {
  try {
    const { clientId, start, end, amount = 0 } = req.body;
    const conflict = await Session.findOne({
      therapist: req.therapist._id,
      status: "Booked",
      start: { $lt: new Date(end) },
      end: { $gt: new Date(start) }
    });
    if (conflict) return res.status(409).json({ message: "This slot is already booked" });
    const client = await Client.findOne({ _id: clientId, therapist: req.therapist._id });
    if (!client) return res.status(404).json({ message: "Client not found" });
    const session = await Session.create({ bookingCode: await uniqueBookingCode(), therapist: req.therapist._id, client: clientId, start, end, amount });
    const populated = await Session.findById(session._id)
      .populate("client", "name email phone")
      .populate("therapist", "name slug");
    const emailNotification = await sendBookingConfirmation({ session: populated, client: populated.client, therapist: populated.therapist }).catch(err => {
      console.error("Booking confirmation email failed:", err.message);
      return { sent: false, reason: err.message };
    });
    res.status(201).json({ session: populated, email: emailNotification });
  } catch (e) { next(e); }
};

exports.publicBook = async (req, res, next) => {
  try {
    const { therapistId, therapistSlug, name, email: clientEmail, phone = "", start, end, amount = 0 } = req.body;

    if ((!therapistId && !therapistSlug) || !name || !clientEmail || !start || !end) {
      return res.status(400).json({ message: "Therapist, name, email, start and end are required" });
    }

    const therapist = therapistId
      ? await Therapist.findById(therapistId)
      : await Therapist.findOne({ slug: therapistSlug });
    if (!therapist) return res.status(404).json({ message: "Therapist not found" });

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      return res.status(400).json({ message: "Invalid session time" });
    }

    const conflict = await Session.findOne({
      therapist: therapist._id,
      status: "Booked",
      start: { $lt: endDate },
      end: { $gt: startDate }
    });
    if (conflict) return res.status(409).json({ message: "This slot is already booked" });

    // Reuse an existing client for this therapist/email, otherwise create one.
    let client = await Client.findOne({ therapist: therapist._id, email: clientEmail.toLowerCase().trim() });
    if (!client) {
      client = await Client.create({
        therapist: therapist._id,
        name: name.trim(),
        email: clientEmail.toLowerCase().trim(),
        phone
      });
    } else {
      client.name = name.trim();
      if (phone) client.phone = phone;
      await client.save();
    }

    const session = await Session.create({
      bookingCode: await uniqueBookingCode(),
      therapist: therapist._id,
      client: client._id,
      start: startDate,
      end: endDate,
      amount,
      status: "Booked"
    });

    const populated = await Session.findById(session._id)
      .populate("client", "name email phone")
      .populate("therapist", "name slug");
    const emailNotification = await sendBookingConfirmation({ session: populated, client: populated.client, therapist: populated.therapist }).catch(err => {
      console.error("Booking confirmation email failed:", err.message);
      return { sent: false, reason: err.message };
    });
    res.status(201).json({ success: true, session: populated, client: populated.client, email: emailNotification });
  } catch (e) { next(e); }
};

exports.publicSlots = async (req, res, next) => {
  try {
    const items = await Availability.find({ therapist: req.params.therapistId, blocked: false });
    const booked = await Session.find({ therapist: req.params.therapistId, status: "Booked", start: { $gte: new Date() } }).select("start end");
    res.json({ availability: items, booked });
  } catch (e) { next(e); }
};


exports.publicClientSessions = async (req, res, next) => {
  try {
    const email = String(req.query.email || "").toLowerCase().trim();
    const code = String(req.query.bookingCode || "").toUpperCase().trim();
    if (!email && !code) return res.status(400).json({ message: "Enter your booking email or booking reference" });
    let sessions = [];
    if (code) {
      sessions = await Session.find({ bookingCode: code })
        .populate("therapist", "name slug")
        .populate("client", "name email phone")
        .sort({ start: 1 });
    } else {
      const clients = await Client.find({ email }).select("_id");
      const ids = clients.map(c => c._id);
      sessions = await Session.find({ client: { $in: ids } })
        .populate("therapist", "name slug")
        .populate("client", "name email phone")
        .sort({ start: 1 });
    }
    const payments = await Payment.find({ client: { $in: sessions.map(s => s.client?._id).filter(Boolean) } });
    const paymentBySession = new Map(payments.filter(p => p.session).map(p => [String(p.session), p]));
    const result = sessions.map(s => ({ ...s.toObject(), payment: paymentBySession.get(String(s._id)) || null }));
    return res.json({ sessions: result });

  } catch (e) { next(e); }
};

exports.publicCancel = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const session = await Session.findById(req.params.sessionId).populate("client", "name email");
    if (!session) return res.status(404).json({ message: "Booking not found" });
    if (String(session.client?.email || "").toLowerCase() !== String(email).toLowerCase().trim()) {
      return res.status(403).json({ message: "Email does not match this booking" });
    }
    if (session.status !== "Booked") return res.status(400).json({ message: `This booking is already ${session.status.toLowerCase()}` });
    if (new Date(session.start) <= new Date()) return res.status(400).json({ message: "Past or started sessions cannot be cancelled online" });
    session.status = "Cancelled";
    session.cancelledBy = "Client";
    session.cancelledAt = new Date();
    session.cancellationReason = "Cancelled by client";
    await session.save();
    const payment = await Payment.findOne({ session: session._id, status: { $in: ["paid", "pending"] } });
    let refund = null;
    if (payment && payment.status === "paid") {
      payment.refund_status = "pending";
      payment.refund_amount = payment.amount || session.amount || 0;
      await payment.save();
      refund = { required: true, status: "pending", amount: payment.refund_amount, paymentId: payment._id };
    }
    res.json({ success: true, session, refund, message: refund ? "Booking cancelled. A refund is pending." : "Booking cancelled successfully" });
  } catch (e) { next(e); }
};

// Therapist cancellation. If a paid UPI payment exists, create a refund-pending record.
exports.therapistCancel = async (req, res, next) => {
  try {
    const session = await Session.findOne({ _id: req.params.sessionId, therapist: req.therapist._id })
      .populate("client", "name email phone");
    if (!session) return res.status(404).json({ message: "Booking not found" });
    if (session.status !== "Booked") return res.status(400).json({ message: `This booking is already ${session.status.toLowerCase()}` });
    if (new Date(session.start) <= new Date()) return res.status(400).json({ message: "Past or started sessions cannot be cancelled" });

    const payment = await Payment.findOne({ session: session._id, status: "paid" });
    session.status = "Cancelled";
    session.cancelledBy = "Therapist";
    session.cancelledAt = new Date();
    session.cancellationReason = "Cancelled by therapist";
    await session.save();

    let refund = null;
    if (payment) {
      payment.refund_status = "pending";
      payment.refund_amount = payment.amount || session.amount || 0;
      await payment.save();
      refund = { required: true, status: "pending", amount: payment.refund_amount, paymentId: payment._id };
    }

    res.json({
      success: true,
      session,
      refund,
      message: payment
        ? "Booking cancelled. A refund is required for this paid session; complete the refund from the dashboard."
        : "Booking cancelled successfully. No paid payment was found, so no refund is required."
    });
  } catch (e) { next(e); }
};
