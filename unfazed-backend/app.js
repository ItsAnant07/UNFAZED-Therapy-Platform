const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const therapistRoutes = require("./src/routes/therapistRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const schedulingRoutes = require("./src/routes/schedulingRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Unfazed API is running", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/scheduling", schedulingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

module.exports = app;
