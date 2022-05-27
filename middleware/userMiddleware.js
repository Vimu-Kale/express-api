const {
  isEmail,
  isPhoneNumber,
  isValidName,
  isValidPassword,
  isDigit,
} = require("../util/validator.js");

const { PASSWORD_RS, NAME_RS, PHONE_RS } = require("../util/ResponseStrings");

const db = require("../config/MysqlKnex");

const getUsers = (myCallback) => {
  db.select("*")
    .from("users")
    .then((data) => {
      myCallback(data);
    })
    .catch((err) => res.status(400).json("Unable to retrive data!"));
};

//MIDDLEWARE FOR LOGIN
const isAuthorized = (req, res, next) => {
  const isAuthorizedCallback = (users) => {
    const { email, password } = req.body;
    const isValidEmail = isEmail(email);

    if (
      !req.body ||
      !email ||
      !password ||
      email.trim().length <= 0 ||
      password.trim().length <= 0
    ) {
      res.status(400).json({ message: "Missing Fields" });
    } else if (isValidEmail) {
      const validUser = users.find((user) => user.email === req.body.email);
      //   console.log(validUser);
      if (typeof validUser != "undefined") {
        req.validUser = validUser;
        next();
      } else {
        res.status(401).json({ message: "Wrong Cradentials" });
      }
    } else {
      res.status(412).json({ message: "Invalid Email" });
    }
  };

  getUsers(isAuthorizedCallback);
};

//MIDDLEWARE FOR SIGNUP
const validateSignUp = (req, res, next) => {
  const validateSignUpCallback = (users) => {
    const { name, phone, email, password } = req.body;
    const exists = users.find((user) => user.email === email);

    if (!req.body || !name || !phone || !email || !password) {
      res.status(400).json({ message: "Missing User Details" });
    } else if (!isValidName(name)) {
      res.status(400).json(NAME_RS);
    } else if (!isPhoneNumber(phone)) {
      res.status(400).json(PHONE_RS);
    } else if (!isEmail(email)) {
      res.status(400).json({ message: "Invalid Email" });
    } else if (!isValidPassword(password)) {
      res.status(400).json(PASSWORD_RS);
    } else {
      req.exists = exists;
      next();
    }
  };

  getUsers(validateSignUpCallback);
};

//VALIDATE USER FOR UPDATE & DELETE
const validateUser = (req, res, next) => {
  const validateUserCallback = (users) => {
    const id = req.query.id;

    if (!id || id.trim().length <= 0) {
      res.status(400).json({ message: "Missing User ID" });
    } else if (!isDigit(id)) {
      res.status(412).json({ message: "Invalid ID" });
    } else {
      const exists = users.find((user) => user.id === Number(id));
      // console.log(exists);
      req.exists = exists;
      next();
    }
  };

  getUsers(validateUserCallback);
};

//MIDDLEWARE FOR UPDATE
const validateUpdate = (req, res, next) => {
  const { name, phone, email, password } = req.body;
  let valid = true;

  if (name) {
    if (!isValidName(name)) {
      valid = false;
      res.status(422).json(NAME_RS);
    }
  }
  if (phone) {
    if (!isPhoneNumber(phone)) {
      valid = false;
      res.status(422).json(PHONE_RS);
    }
  }
  if (email) {
    valid = false;
    res.status(422).json({ message: "You can not update email!" });
  }
  if (password) {
    if (!isValidPassword(password)) {
      valid = false;
      res.status(422).json(PASSWORD_RS);
    }
  }
  if (valid) {
    next();
  }
};

module.exports = {
  isAuthorized,
  validateSignUp,
  validateUser,
  validateUpdate,
  getUsers,
};
