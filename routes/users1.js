const db = require("../config/MysqlKnex");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  isAuthorized,
  validateSignUp,
  validateUser,
  validateUpdate,
} = require("../middleware/userMiddleware.js");

// /users
router.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(400).json("Unable to retrive data!"));
});

router.get("/user", validateUser, (req, res) => {
  if (req.exists) {
    console.log("hii");
    db.select("*")
      .from("users")
      .where("id", req.query.id)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.status(400).json("Unable to retrive data!"));
  } else {
    res.status(409).json({ message: "User Doesn't Exist" });
  }
});

// /users/login
router.post("/login", isAuthorized, (req, res) => {
  const result = bcrypt.compareSync(req.body.password, req.validUser.password);
  if (result) {
    res.status(200).json({ message: "Login Successful" });
  } else {
    res.status(401).json({ message: "Wrong Cradentials" });
  }
});

// /users/signup
router.post("/signup", validateSignUp, (req, res) => {
  const { name, phone, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  if (!req.exists) {
    db("users")
      .insert({
        name,
        phone,
        email,
        password: hash,
      })
      .then((response) => {
        // console.log(response);
        res.status(200).json({ message: "Registration SuccessFul" });
      })
      .catch((e) => console.log("ERROR:", e));
  } else {
    res.status(409).json({ message: "Email Already Exist" });
  }
});

//UPDATE & DELETE ROUTE
router
  .route("/")
  .patch([validateUser, validateUpdate], (req, res) => {
    const { name, phone, password } = req.body;

    if (req.exists) {
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
      }
      let user = {
        name: name || req.exists.name,
        phone: phone || req.exists.phone,
        email: req.exists.email,
        password: hash || req.exists.password,
      };

      // console.log(user);

      db("users")
        .where("id", "=", req.query.id)
        .update(user)
        .then((response) => {
          // console.log(response);
          res.status(200).json({ message: "user Updated Successfully" });
        })
        .catch((e) => {
          console.log(e);
          res.json("Failed To Update User");
        });
    } else {
      res.status(409).json({ message: "User Doesn't Exist" });
    }
  })

  //DELETE USER USING EMAIL
  .delete(validateUser, (req, res) => {
    if (req.exists) {
      db("users")
        .where("id", req.query.id)
        .del()
        .then((response) => {
          // console.log(response);
          res.status(200).json({ message: "User Delated Successfully" });
        })
        .catch((e) => {
          console.log(e);
          res.status(200).json({ message: "Unable Delated Record" });
        });
    } else {
      res.status(409).json({ message: "User Does Not Exist" });
    }
  });

router.all("*", (req, res) => {
  res.status(400).json({ message: "Route Does Not Exist" });
});

module.exports = router;
