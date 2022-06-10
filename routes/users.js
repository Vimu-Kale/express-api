const express = require("express");
const router = new express.Router();
const {
  validatePassword,
  isValidID,
  validateLoginDetails,
  authenticateToken,
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

router.get("/", authenticateToken, handleFetchUsers);

router.post("/signup", validatePassword, handleSignUp);

router.get("/user", authenticateToken, isValidID, handleGetUserByID);

router.delete("/", authenticateToken, isValidID, handleHardDeleteByID);

router.delete(
  "/softdelete",
  authenticateToken,
  isValidID,
  handleSoftDeleteByID
);

router.patch(
  "/",
  [authenticateToken, isValidID, validatePassword],
  handleUpdateByID
);

//LOGIN
// refer to "authServer.js" for Login Route For JWT & refresh Token Generation and deletion
// router.post("/login", validateLoginDetails, handleUserLogin);

module.exports = router;
