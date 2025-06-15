import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { hashPassword } from "../lib/hash_password.js";
import { generateToken } from "../lib/jwt_token.js";
import cloudinary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {
  try {
    const { firstname, email, password } = req.body;
    if (!firstname || !email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Atleast have 6 letters" });
    }
    const exist_user = await User.findOne({ email });
    if (exist_user) {
      return res
        .status(409)
        .json({ message: "User Already Exist, Please Login" });
    }

    const hashed_password = await hashPassword(password);
    const new_user = await User({
      firstname,
      email,
      password: hashed_password,
    });

    if (new_user) {
      generateToken(new_user._id, res);
      await new_user.save();
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
    res.status(201).json({ message: "New User Created Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on signup controller : ${error.message}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const check_password = await bcryptjs.compare(password, user.password);
    if (!check_password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json({ message: "SignIn Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on signIn controller : ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on Logout controller : ${error.message}` });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilepic } = req.body;
    const userId = req.user._id;
    if (!profilepic) {
      return res.status(400).json({ message: "Profile Pic is Required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilepic);
    const updateUser = await User.findByIdAndUpdate(
      { userId },
      { profilepic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error on Profile pic controller : ${error.message}` });
  }
};

export const check = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
