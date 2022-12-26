const jwt = require("jsonwebtoken");

const validateJwt = (req, res, next) => {
  const token = req.header("x-token");
  if (!token)
    return res.status(401).json({
      ok: false,
      msg: "Acceso denegado. Se necesita token",
    });
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    console.log({ data });
    const { uid, name } = data;
    req.uid = uid;
    req.name = name;
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      msg: "Token no valido",
    });
  }
  next();
};

module.exports = {
  validateJwt,
};
