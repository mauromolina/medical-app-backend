const { Router } = require("express");
const { newUser, login, refreshToken } = require("../controllers/auth");
const { checkNewUser, checkLogin } = require("../middlewares/checkValidation");
const { validateJwt } = require("../middlewares/validateJwt");

const router = Router();

router.post("/new", checkNewUser(), newUser);
router.post("/", checkLogin(), login);
router.get("/refresh-token", validateJwt, refreshToken);

module.exports = router;
