const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/noteController");

router.get("/", protect, c.list);
router.post("/", protect, c.create);
router.get("/client/:clientId/shared", c.clientShared);

module.exports = router;
