const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Therapist = require("../models/Therapist");

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function tokenFor(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    if (await Therapist.findOne({ email })) return res.status(409).json({ message: "Email already registered" });

    let slug = slugify(name);
    if (await Therapist.findOne({ slug })) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const password_hash = await bcrypt.hash(password, 12);
    const therapist = await Therapist.create({ name, email, password_hash, slug });

    res.status(201).json({
      success: true,
      token: tokenFor(therapist._id),
      therapist: { id: therapist._id, name: therapist.name, email: therapist.email, slug: therapist.slug }
    });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const therapist = await Therapist.findOne({ email });
    if (!therapist || !(await bcrypt.compare(password, therapist.password_hash)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      success: true,
      token: tokenFor(therapist._id),
      therapist: { id: therapist._id, name: therapist.name, email: therapist.email, slug: therapist.slug, tier: therapist.tier }
    });
  } catch (e) { next(e); }
};
