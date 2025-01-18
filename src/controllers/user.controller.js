import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details
  // 2. perform validation
  // 3. check if user is already registered -> both username and email
  // 4. create an user object -> entry to db
  // 5. remove password and refresh token from the response
  // 6. check user creation
  // 7. return response

  // 1.
  const { fullName, username, email, password } = req.body;
  // console.log("req.body");
  // console.log(req.body);

  //2.
  const requiredFields = { fullName, email, username, password };
  // Check for missing or empty fields
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value || typeof value !== "string" || value.trim() === "") {
      throw new ApiError(400, `Field '${key}' is required and cannot be empty`);
    }
  }

  // 3.
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 4.
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    email: email.toLowerCase(),
    password: password.toLowerCase(),
    username: username.toLowerCase(),
  });

  // 5.
  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  // 6.
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  // 7.
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // 1. get user details
  // 2. find the user -> with email or username
  // 3. check password
  // 4. init access and refresh token
  // 5. remove password and refresh token from the response
  // 6. set cookie
  // 7. return response

  // 1.
  const { emailOrUsername, password } = req.body;
  if (!(emailOrUsername && password)) {
    throw new ApiError(400, "Email or username with password is required");
  }

  // 2.
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 3.
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user password");
  }

  // 4.
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // 5.
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 6.
  const options = {
    httpOnly: true,
    secure: true,
  };

  // 7.
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // 1. get the user and update refresh token
  // 2. clear cookie
  // 3. return response

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
