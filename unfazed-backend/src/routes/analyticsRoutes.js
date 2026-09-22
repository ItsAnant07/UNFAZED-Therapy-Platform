const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const { dashboard } = require("../controllers/analyticsController");
router.get("/dashboard", protect, dashboard);
module.exports = router;
