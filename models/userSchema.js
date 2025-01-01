import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  phone: {
    type: String,
    required: [true, "Phone Number is Required"],
  },
  aboutMe: {
    type: String,
    required: [true, "About is Required"],
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minLength: [8, "Password must contain at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  portfolioURL: {
    type: String,
    required: [true, "Portfolio URL is Required"],
  },
  githubURL: String,
  linkedINURL: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10); // this will hash the password with 10 salt rounds
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // this will compare passwords
};

userSchema.methods.generateJsonWebToken = function () {
  return Jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

export const User = mongoose.model("User", userSchema);
