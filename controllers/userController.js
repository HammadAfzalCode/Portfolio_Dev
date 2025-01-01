import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar and Resume are required", 400));
  }
  const { avatar, resume } = req.files;
  const cloudinaryAvatarRes = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "AVATAR" }
  );
  if (!cloudinaryAvatarRes || cloudinaryAvatarRes.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryAvatarRes.error || "Unknown Cloudinary Error"
    );
  }
  const cloudinaryResumeRes = await cloudinary.uploader.upload(
    resume.tempFilePath,
    { folder: "My_Resume" }
  );
  if (!cloudinaryResumeRes || cloudinaryResumeRes.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResumeRes.error || "Unknown Cloudinary Error"
    );
  }

  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedInURL,
  } = req.body;
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    linkedInURL,
    avatar: {
      public_id: cloudinaryAvatarRes.public_id,
      url: cloudinaryAvatarRes.secure_url,
    },
    resume: {
      public_id: cloudinaryResumeRes.public_id,
      url: cloudinaryResumeRes.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "User Registered",
  });
});
