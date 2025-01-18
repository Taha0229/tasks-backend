import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// public authentication routes
router.route("/register").post(registerUser); // register a new user
router.route("/login").post(loginUser); // log in a user

// secured authentication and user profile routes
router.route("/logout").post(verifyJWT, logoutUser); // log out the current user
router.route("/refresh-token").post(refreshAccessToken); // refresh access token
router.route("/change-password").post(verifyJWT, changeCurrentPassword); // change current user's password
router.route("/current-user").get(verifyJWT, getCurrentUser); // get current user details

export default router;
