import Mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name."],
    minlength: [3, "Name must be at least 3 characters."],
    maxLength: [20, "Name must be at most 50 characters."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email."],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password."],
    minlength: [6, "Password must be at least 6 characters."],
    select: false,
  },
  lastName: {
    type: String,
    required: false,
    maxLength: [20, "Name must be at most 20 characters."],
    trim: true,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxLength: [20, "Name must be at most 20 characters."],
    default: "my location",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default Mongoose.model("User", userSchema);