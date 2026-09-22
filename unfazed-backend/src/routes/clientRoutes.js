const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/clientController");

router.get("/", protect, c.list);
router.post("/", protect, c.create);
router.put("/:id", protect, c.update);
router.post("/public/intake/:therapistId", c.publicIntake);

module.exports = router;
