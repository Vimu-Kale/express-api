const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../model/user");
const jwt = require("jsonwebtoken");

//ERROR HANDLERS
const handleValidationError = (err) => {
  let message;
  const key = Object.keys(err.errors);

  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message;
  }
  return message;
};
const handleDuplicateField = (err) => {
  let message;
  const keys = Object.keys(err.keyValue);
  if (keys.includes("email")) message = "User already exists";
  return message;
};

//GET ALL USERS
// --------------------------------------------------------------------------------------------------

const handleFetchUsers = async (req, res) => {
  try {
    const userdocuments = await User.find({ isDeleted: false });
    if (!userdocuments) {
      res
        .status(500)
        .json({ success: true, message: "Unable To Fetch Details" });
    } else if (userdocuments.length === 0) {
      res.status(404).json({
        success: true,
        message: "Users Collection Empty",
        payload: userdocuments,
      });
    } else {
      res.status(200).json({ success: true, userdocuments });
    }
  } catch (error) {
    res.status(500).json({ success: true, message: "Unable To Fetch Details" });
  }
};

//SIGNUP
// ------------------------------------------------------------------------------------------

const handleSignUp = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const user = await User({
      name,
      email,
      password,
      phone,
    });

    const newUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User Saved Successfully",
      payload: newUser,
    });
  } catch (e) {
    let message = "something went wrong";
    if (e.code === 11000) message = handleDuplicateField(e);
    if (e.name === "ValidationError") message = handleValidationError(e);
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
};

//GET BY ID
//---------------------------------------------------------------------------------------------

const handleGetUserByID = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.query.id }).where({
      isDeleted: false,
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({ success: true, payload: user });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: true, message: "Could not fetch the document" });
  }
};

//HARD DELETE
// -------------------------------------------------------------------------------------------------------

const handleHardDeleteByID = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete({ _id: req.query.id });
    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        payload: deletedUser,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete the User" });
  }
};

// SOFT DELETE
//----------------------------------------------------------------------------------------------------------
const handleSoftDeleteByID = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndUpdate(
      { _id: req.query.id },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        payload: deletedUser,
      });
    }
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "couldn't delete the User" });
  }
};
//UPDATE
// -------------------------------------------------------------------------------------------

const handleUpdateByID = async (req, res) => {
  try {
    const _id = req.query.id;
    const updatedUser = await User.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        payload: updatedUser,
      });
    }
  } catch (e) {
    let message = "Unable To Update User Details";
    if (e.code === 11000) message = handleDuplicateField(e);
    if (e.name === "ValidationError") message = handleValidationError(e);
    return res.status(400).json({
      success: false,
      message: message,
    });
  }
};

//--------------------------------------------------------------------------------
//LOGIN:  REFER TO "authServer.js" for JWT Token & Refresh Token
// --------------------------------------------------------------------------------
//LOGIN WITHOUT AUTHENTICATION
const handleUserLogin = async (req, res) => {
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
        const accessToken = jwt.sign(
          userLogin.toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
          success: true,
          message: "Login Successfull",
          payload: userLogin,
          accessToken: accessToken,
        });
      }
    } else {
      res.status(400).json({ success: true, message: "Invalid Credientials" });
    }
  } catch (e) {
    res.status(500).json({ success: "false", message: "Unable To Login User" });
  }
};

module.exports = {
  handleFetchUsers,
  handleSignUp,
  handleGetUserByID,
  handleHardDeleteByID,
  handleSoftDeleteByID,
  handleUpdateByID,
  handleUserLogin,
};
