const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token Field Is Required"],
  },
});

const Token = new mongoose.model("Token", tokenSchema);

module.exports = Token;
