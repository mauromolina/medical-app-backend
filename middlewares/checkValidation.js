const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");
const { validate } = require("../models/User");

const checkNewUser = () => [
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("email", "El email es obligatorio").isEmail(),
  check("password", "La contraseña es obligatoria").not().isEmpty(),
  check("password", "La contraseña debe ser mayor a 6 caracteres").isLength({
    min: 6,
  }),
  validate,
];

const checkLogin = () => [
  check("email", "El email es obligatorio").isEmail(),
  check("password", "La contraseña es obligatoria").not().isEmpty(),
  validate,
];

const checkNewRecord = () => [
  check("title", "El título es obligatorio").not().isEmpty(),
  check("start", "La fecha de inicio es obligatoria").custom(isDate),
  validate,
];

module.exports = {
  checkNewUser,
  checkLogin,
  checkNewRecord,
};
