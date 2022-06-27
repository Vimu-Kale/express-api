const express = require("express");
const router = new express.Router();
const {
  validatePassword,
  isValidID,
  // validateLoginDetails,
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

const {
  handleFilderByDate,
  handleSortByName,
} = require("../controller/employeeController");

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

router.get("/filterbydate", authenticateToken, handleFilderByDate);

router.get("/sortbyname", authenticateToken, handleSortByName);

module.exports = router;
