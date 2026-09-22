const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/schedulingController");

router.get("/availability", protect, c.availability);
router.post("/availability", protect, c.setAvailability);
router.get("/sessions", protect, c.sessions);
router.post("/book", protect, c.book);
router.post("/:sessionId/cancel", protect, c.therapistCancel);
router.get("/public/:therapistId", c.publicSlots);
router.post("/public/book", c.publicBook);
router.get("/public/client-sessions", c.publicClientSessions);
router.post("/public/:sessionId/cancel", c.publicCancel);

module.exports = router;
