import e from "express";
import User from "../models/user-model.js";
import bcrypt from "bcryptjs";

//controllers basivally handles the request and response of the route and send the response to the client side i.e write the logic here
export const home = async (req, res) => {
  try {
    // console.log(req.body); //req.body is used to get the data from the request
    res.status(200).send("Backend is running 🚀");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    //Salt makes the same password look different every time or extra random value added to your password to protect from the hacker before hashing(encrypting). same logic can write in model file to avoid the mistake like to forget write password: hashedPassword,so that why pre middleware is used that automatically hash the password before saving the data in database safer way to do it
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      username,
      email,
      // password: hashedPassword,
      password,
      phone,
    });

    // res.status(200).send("Hello Register!");
    res.status(200).json({
      message: "Register successfully",
      token: await createUser.generateAuthToken(),
      user_id: createUser._id.toString(),
    });
    console.log(req.body);
  } catch (error) {
    // next(error);

    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// REGISTER:
// User → DB → New user created → Token

// LOGIN:
// User → DB → Check user in db → Match password → Token

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).send({ message: "User does not exist" });
    }

    // const isPasswordMatched = await bcrypt.compare(
    //   password,
    //   userExist.password,
    // );

    const isPasswordMatched = await userExist.comparePassword(password);

    if (isPasswordMatched) {
      res.status(200).send({
        message: "Login successfully",
        token: await userExist.generateAuthToken(),
        user_id: userExist._id.toString(),
      });
      console.log(req.body);
    } else {
      return res.status(400).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const user = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    return res.status(200).send(userData);
  } catch (error) {
    res.status(500).send("error from user route", error.message);
  }
};
