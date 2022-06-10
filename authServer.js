const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

require("dotenv").config();
require("./db/connection");

var cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const Token = require("./model/token");

const PORT = process.env.AUTH_PORT || 3000;

const { validateLoginDetails } = require("./middleware/userMiddleware");

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null)
    return res
      .status(401)
      .json({ success: false, message: "No Token Received" });
  const token = await Token.find({ token: refreshToken });
  if (token.length === 0) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid Refresh Token/Access Denied" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Access Denied" });
    const accessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: accessToken });
  });
});

app.delete("/logout", async (req, res) => {
  try {
    const deletedToken = await Token.findOneAndDelete({
      token: req.body.token,
    });
    if (!deletedToken) {
      res.status(400).json({ success: false, message: "Token Not Found" });
    } else {
      res.status(200).json({
        success: true,
        message: "Token Deleted successfully",
        payload: deletedToken,
      });
    }
  } catch (e) {
    res.status(400).json({ success: false, message: "Unable To Delete Token" });
  }
});

app.post("/users/login", validateLoginDetails, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userLogin = await User.findOne({ email: email, isDeleted: false });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Credientials" });
      } else {
        const accessToken = generateAccessToken(userLogin.toJSON());
        const refreshToken = jwt.sign(
          userLogin.toJSON(),
          process.env.REFRESH_TOKEN_SECRET
        );
        try {
          const token = await Token({ token: refreshToken });
          await token.save();
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: "Token Not Saved",
          });
        }
        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: userLogin,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } else {
      res.status(400).json({ success: true, message: "Invalid Credientials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: "false", message: "Unable To Login User" });
  }
});

const generateAccessToken = (userLogin) => {
  return jwt.sign(userLogin, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
