require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected...");
  })
  .catch((e) => {
    console.log("Error Connecting...", e);
  });
