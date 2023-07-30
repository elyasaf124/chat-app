import express from "express";
import {
  auth,
  logOut,
  login,
  protect,
  signup,
} from "../controllers/authController";
import {
  getMe,
  createUser,
  addUserContactById,
  getAllUsersContact,
  searchUser,
  addUserContact,
  getData,
  deleteContact,
} from "../controllers/userController";
import { presignedURL } from "../cloudinary";

export const router = express.Router();

router.route("/register").post(signup);

router.route("/login").post(login);

router.get("/logout", protect, logOut);

router.get("/getMe", protect, getMe);

router.get("/search/:userName", protect, searchUser);

router.post("/addUserContactById", protect, addUserContactById);

router.post("/addUserContact", protect, addUserContact);

router.get("/getAllUsersContact", protect, getAllUsersContact);

router.post("/createUser", createUser);

router.get("/get-signature", presignedURL);

router.get("/getData", protect, getData);

router.patch("/deleteContact", protect, deleteContact);
