const jwt = require("jsonwebtoken");

const validateJwt = (req, res, next) => {
  const token = req.header("x-token");
  if (!token)
    return res.status(401).json({
      ok: false,
      code: "NEED_TOKEN",
    });
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT);
    const { uid, name } = data;
    req.uid = uid;
    req.name = name;
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      ok: false,
      code: "INVALID_TOKEN",
    });
  }
  next();
};

module.exports = {
  validateJwt,
};
