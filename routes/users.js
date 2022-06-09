const express = require("express");
const router = new express.Router();
const {
  validatePassword,
  isValidID,
  validateLoginDetails,
} = require("../middleware/userMiddleware");

const {
  handleFetchUsers,
  handleSignUp,
  handleGetUserByID,
  handleHardDeleteByID,
  handleSoftDeleteByID,
  handleUpdateByID,
  handleUserLogin,
} = require("../controller/userController");

router.get("/", handleFetchUsers);

router.post("/signup", validatePassword, handleSignUp);

router.get("/user", isValidID, handleGetUserByID);

router.delete("/", isValidID, handleHardDeleteByID);

router.delete("/softdelete", isValidID, handleSoftDeleteByID);

router.patch("/", [isValidID, validatePassword], handleUpdateByID);

router.post("/login", validateLoginDetails, handleUserLogin);

module.exports = router;
