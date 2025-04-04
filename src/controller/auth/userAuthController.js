const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../services/authServices");
const dbService = require("../../utils/dbServices");
const User = require("../../model/UserModel");

/**
 * @description : Sign up a new user.
 * @param {Object} req : The request object including body for fullname, dob, email, and password.
 * @param {Object} res : The response object to send back the signup status, access token, and new user details.
 * @fields : fullname, dob, email, password
 * @return {Object} : Status message indicating the result of the signup operation, access token, and new user details. {status, accessToken, newUser}
 */
const signUp = async (req, res, next) => {
  try {
    const { fullname, dob, email, password } = req.body;

    if (!fullname || !dob || !email || !password) {
      return res.badRequest({ message: "All fields are required." });
    }

    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });

    if (user) {
      return res.badRequest({ message: "User already exists, please login." });
    }

    const dataToCreate = { fullname, dob, email: lowerCaseEmail, password };
    const newUser = await dbService.create(User, dataToCreate);

    if (!newUser) {
      return res.badRequest({ message: "Something went wrong, Registration failed." });
    }

    const accessToken = await generateToken({ id: newUser._id }, process.env.JWT_SECRET, "7d");

    return res.status(201).json({
      status: "success",
      accessToken,
      newUser,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : Log in a user.
 * @param {Object} req : The request object including body for email and password.
 * @param {Object} res : The response object to send back the login status and access token.
 * @fields : email, password
 * @return {Object} : Status message indicating the result of the login operation, access token, and user details. {status, message, accessToken, user}
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.badRequest({ message: "Please provide email and password" });
    }

    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail }).select("+password");

    if (!user) {
      return res.badRequest({ message: "User doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.badRequest({ message: "Incorrect password" });
    }

    const accessToken = await generateToken({ id: user._id }, process.env.JWT_SECRET, "7d");

    return res.status(200).json({
      status: "success",
      message: "Login successfully!",
      accessToken,
      user,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  signUp,
  loginUser,
};
