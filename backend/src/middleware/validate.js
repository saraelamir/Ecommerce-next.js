const { validationResult } = require("express-validator");

module.exports = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ statusCode: 400, message: errors.array()[0].msg });
  }
  next();
};
