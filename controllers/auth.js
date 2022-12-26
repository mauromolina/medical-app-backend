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
        msg: "El email ya está en uso",
      });
    }
    const user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    const token = await generateJwt(user.id, user.name);
    res.status(201).json({
      ok: true,
      msg: "User created",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al crear nuevo usuario",
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
        msg: "El usuario o email no existe",
      });
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({
        ok: false,
        msg: "Email o contraseña incorrectos.",
      });
    const token = await generateJwt(user.id, user.name);
    res.status(200).json({
      ok: true,
      msg: "User logged",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al iniciar sesión",
    });
  }
};

const refreshToken = async (req, res) => {
  const { uid, name } = req;
  try {
    const token = await generateJwt(uid, name);
    res.status(200).json({
      ok: true,
      msg: "Token refreshed",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al generar token",
    });
  }
};

module.exports = {
  newUser,
  login,
  refreshToken,
};
