const { Router } = require("express");
const { newUser, login, refreshToken } = require("../controllers/auth");
const { checkNewUser, checkLogin } = require("../middlewares/checkValidation");

const router = Router();

router.post("/new", checkNewUser(), newUser);
router.post("/", checkLogin(), login);
router.post("/refresh-token", refreshToken);

module.exports = router;
