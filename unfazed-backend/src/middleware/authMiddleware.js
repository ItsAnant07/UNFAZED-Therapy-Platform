const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const therapist = await Therapist.findById(decoded.id).select("-password_hash");
    if (!therapist) return res.status(401).json({ message: "Invalid user" });
    req.therapist = therapist;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = protect;
