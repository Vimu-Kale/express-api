const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// const validatePassword = (password) => {
//   const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,32}$/;
//   return regex.test(password);
// };

const validatePhone = (phone) => {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return regex.test(phone);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Field Is Required"],
    lowercase: true,
    minlength: [2, "Name must be grater than or qual to two letters"],
  },
  email: {
    type: String,
    required: [true, "Email Field Is Required"],
    unique: [true, "Email ID Already Taken"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  phone: {
    type: String,
    required: [true, "Phone Number Is Required"],
    unique: [true, "Phone Number Already Exists"],
    validate: [validatePhone, "Phone Number Must Be Of 10 Digits"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Password Field Is Required"],
  },
});

//We Are Hashing Password Here using pre method

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = bcrypt.hash(this.password, 10);
//   }
// });

const User = new mongoose.model("User", userSchema);

module.exports = User;
