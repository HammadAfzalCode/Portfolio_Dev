import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

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
  generateToken(user, "user Registered", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email And Password Are Required"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password"));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password"));
  }
  generateToken(user, "Logged In", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Our",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsyncErrors(async (res, req, next) => {
  const newUserData = {
    fullName: req?.body?.fullName,
    email: req?.body?.email,
    phone: req?.body?.phone,
    aboutMe: req?.body?.aboutMe,
    portfolioURL: req?.body?.portfolioURL,
    githubURL: req?.body?.githubURL,
    linkedInURL: req?.body?.linkedInURL,
  };
  if (req?.files && req?.files?.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user.id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "AVATAR" }
    );
    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  if (req.files && req.files.resume) {
    const avatar = req.files.resume;
    const user = await User.findById(req.user.id);
    const profileResumeId = user.resume.public_id;
    await cloudinary.uploader.destroy(profileResumeId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      { folder: "My_Resume" }
    );
    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Profile Updated",
    user,
  });
});
