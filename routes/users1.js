const db = require("../config/MysqlKnex").default;
const express = require("express");
const router = express.Router();
const {
  isAuthorized,
  getUsers,
  validateSignUp,
  validateUser,
  validateUpdate,
} = require("../middleware/userMiddleware.js");
const fs = require("fs");
const { response } = require("express");

// /users
router.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(400).json("Unable to retrive data!"));
});

// /users/login
router.post("/login", isAuthorized, (req, res) => {
  if (req.validUser.password === req.body.password) {
    res.status(200).json({ message: "Login Successful" });
  } else {
    res.status(401).json({ message: "Wrong Cradentials" });
  }
});

// /users/signup
router.post("/signup", validateSignUp, (req, res) => {
  const { name, phone, email, password } = req.body;
  //   const users = getUsers();
  if (!req.exists) {
    db("users")
      .insert({
        name,
        phone,
        email,
        password,
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
    const { name, phone, email, password } = req.body;

    if (req.exists) {
      let user = {
        name: name || req.exists.name,
        phone: phone || req.exists.phone,
        email: email || req.exists.email,
        password: password || req.exists.password,
      };

      // console.log(user);

      db("users")
        .where("email", "=", req.query.email)
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
    // const users = getUsers();
    if (req.exists) {
      db("users")
        .where("email", req.query.email)
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

// const setUser = (users) => {
//   try {
//     fs.writeFileSync("./util/users.json", JSON.stringify(users));
//   } catch (e) {
//     console.log(e);
//   }
// };

module.exports = router;
