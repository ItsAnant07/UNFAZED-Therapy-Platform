const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/therapistController");

router.get("/public-list", c.publicList);
router.get("/public/:slug", c.publicProfile);
router.get("/me", protect, c.me);
router.put("/me", protect, c.update);
router.get("/entitlements", protect, c.entitlements);

module.exports = router;
