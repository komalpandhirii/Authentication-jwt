import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
// require("dotenv").config();


// const JWT_SECRET_KEY = "dpe78djdk9089dj";

class UserController {
  static userRegisteration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({
        status: "Failed",
        message: "email already exists",
      });
    } else {
      if (
        name != null &&
        email != null &&
        (password != null) & (password_confirmation != null) &&
        tc != null
      ) {
        if (password == password_confirmation) {
          try {
            // console.log(process.env.JWT_SECRET_KEY);
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });

            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            //Generate JWT Token
            const token = jwt.sign({ userID: saved_user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: "20m",
            });
            res.status(201).send({
              status: "Success",
              message: "Successfully Registered",
              token: token,
            });
          } catch (err) {
            console.log(err);
            res.send({
              status: "Failed",
              message: "Unable to Register",
            });
          }
        } else {
          res.send({
            status: "Failed",
            message: "Password and Confirm Password doesn't match",
          });
        }
      } else {
        res.send({
          status: "Failed",
          message: "All Fields are required",
        });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if ((email, password)) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            res.send({
              status: "Success",
              message: "Successfully Logged In",
            });
          } else {
            res.send({
              status: "Failed",
              message: "Email or Password is not Valid",
            });
          }
        } else {
          res.send({
            status: "Failed",
            message: "Not a regitered user",
          });
        }
      } else {
        res.send({
          status: "Failed",
          message: "All Fields are required",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: "Failed",
        message: "Unabled to Loggin",
      });
    }
  };

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.send({
          status: "Failed",
          message: "Password and Confirm password does not Match",
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const newHashPassword = await bcrypt.hash(password, salt);
      }
    } else {
      res.send({
        status: "Failed",
        message: "All Fields are required",
      });
    }
  };
}

export default UserController;
