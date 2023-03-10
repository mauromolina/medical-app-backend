const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJwt } = require("../helpers/jwt");

const newUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let emailInUse = await User.findOne({ email });
    if (emailInUse) {
      return res.status(400).json({
        ok: false,
        code: "EMAIL_ALREADY_EXISTS",
      });
    }
    const user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    const token = await generateJwt(user.id, user.name);
    res.status(201).json({
      ok: true,
      user,
      uid: user.id,
      token,
      code: "USER_CREATED",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "REGISTER_SERVER_ERROR",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        ok: false,
        code: "USR_NOT_EXISTS",
      });
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({
        ok: false,
        code: "LOGIN_INVALID_CREDENTIALS",
      });
    const token = await generateJwt(user.id, user.name);
    res.status(200).json({
      ok: true,
      user,
      uid: user.id,
      token,
      code: "LOGIN_SUCCESSFUL",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "LOGIN_SERVER_ERROR",
    });
  }
};

const refreshToken = async (req, res) => {
  const { uid, name } = req;
  try {
    const token = await generateJwt(uid, name);
    res.status(200).json({
      ok: true,
      user: { uid, name },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      code: "REFRESH_TOKEN_ERROR",
    });
  }
};

module.exports = {
  newUser,
  login,
  refreshToken,
};
