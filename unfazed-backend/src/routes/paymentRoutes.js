const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/paymentController");

router.post("/create", protect, c.create);
router.get("/", protect, c.list);
router.patch("/:paymentId/status", protect, c.updateStatus);
router.patch("/:paymentId/refund", protect, c.refund);

router.get("/public/:sessionId", c.publicDetails);
router.post("/public/:sessionId/upi", c.publicUpi);

module.exports = router;
