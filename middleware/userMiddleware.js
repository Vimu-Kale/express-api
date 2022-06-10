const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validatePasswordExp = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/;
  return regex.test(password);
};

const validatePassword = (req, res, next) => {
  const password = req.body.password;

  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "No Fields Passed To Update",
    });
  } else {
    if (password) {
      if (!validatePasswordExp(password)) {
        res.status(400).json({
          success: false,
          message:
            "Password must contain a special character, one lowercase & Uppercase character and atleast one number and length between 8-32",
        });
      } else {
        const passwordHash = async (password) => {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          req.body.password = hash;
          next();
        };
        passwordHash(password);
      }
    } else {
      next();
    }
  }
};

const isValidID = (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    res
      .status(400)
      .json({ success: false, message: "ID Field Cannot Be Empty" });
  } else if (!ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Pass A Valid ID" });
  } else {
    next();
  }
};

const validateLoginDetails = (req, res, next) => {
  const { email, password } = req.body;
  if (Object.keys(req.body).length === 0) {
    res.status(500).json({
      success: false,
      message: "Empty Body! Cannot Login",
    });
  } else if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Fields Cannot Stay Empty" });
  } else {
    next();
  }
};

//AUTHENTICATE TOKEN
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "No Token Received" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userLogin) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Invalid Token Or No Longer Valid" });
    req.userLogin = userLogin;
    next();
  });
}

module.exports = {
  validatePassword,
  isValidID,
  validateLoginDetails,
  authenticateToken,
};
