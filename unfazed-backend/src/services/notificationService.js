const nodemailer = require("nodemailer");

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getTransporter() {
  console.log("SMTP CHECK:", {
    host: !!process.env.SMTP_HOST,
    user: !!process.env.SMTP_USER,
    pass: !!process.env.SMTP_PASS,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE
  });

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendBookingConfirmation({ session, client, therapist }) {
  const to = String(client?.email || "").trim();
  if (!to) return { sent: false, reason: "Client has no email address" };

  const subject = `Booking confirmed · ${therapist?.name || "Unfazed therapist"} · ${session.bookingCode}`;
  const when = formatDate(session.start);
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const bookingUrl = `${appUrl}/my-bookings?code=${encodeURIComponent(session.bookingCode)}&email=${encodeURIComponent(to)}`;
  const amount = Number(session.amount || 0).toLocaleString("en-IN");

  const text = [
    `Hi ${client?.name || "there"},`,
    "",
    "Your Unfazed therapy session is confirmed.",
    "",
    `Therapist: ${therapist?.name || "Therapist"}`,
    `Date & time: ${when}`,
    `Session: Online · 50 minutes`,
    `Fee: ₹${amount}`,
    `Booking reference: ${session.bookingCode}`,
    "",
    `View your booking: ${bookingUrl}`,
    "",
    "Please keep your booking reference. If the therapist cancels a paid session, the refund status will be shown in My Bookings.",
    "",
    "Unfazed · Private · Secure · Human"
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#1d2a24;line-height:1.6">
      <div style="padding:28px;background:#f4f2eb;border-radius:18px">
        <div style="font-size:28px;font-weight:700;margin-bottom:18px">unfazed</div>
        <h1 style="font-size:28px;font-weight:600">Your session is confirmed.</h1>
        <p>Hi ${escapeHtml(client?.name || "there")}, your therapy session has been booked successfully.</p>
        <div style="background:#fff;border:1px solid #dedbd2;border-radius:14px;padding:20px;margin:20px 0">
          <p><b>Therapist</b><br/>${escapeHtml(therapist?.name || "Therapist")}</p>
          <p><b>Date & time</b><br/>${escapeHtml(when)}</p>
          <p><b>Session</b><br/>Online · 50 minutes</p>
          <p><b>Fee</b><br/>₹${amount}</p>
          <p><b>Booking reference</b><br/><span style="font-size:18px">${escapeHtml(session.bookingCode)}</span></p>
        </div>
        <a href="${bookingUrl}" style="display:inline-block;background:#1d2a24;color:#fff;text-decoration:none;padding:13px 20px;border-radius:999px">View my booking</a>
        <p style="font-size:12px;color:#6d716d;margin-top:24px">Keep your booking reference. Never share your UPI PIN, OTP or banking password.</p>
      </div>
    </div>`;

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[Email not sent: SMTP not configured] Booking ${session.bookingCode} for ${to}`);
    return { sent: false, reason: "SMTP not configured" };
  }

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
  console.log(`[Email sent] Booking ${session.bookingCode} -> ${to}`);
  return { sent: true };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = { sendBookingConfirmation };
