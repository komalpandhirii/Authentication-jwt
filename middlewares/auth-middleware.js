import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startswith("bearer")) {
    try {
      token = authorization.split(" ")[1];
      // Verify Token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Get user from token
      req.user = await UserModel.findById(userId).select(-password);
      next();
    } catch (error) {
      res.send({
        status: "Failed",
        message: "Unauthorized user",
      });
    }
  }

  if (!token) {
    res.send({
      status: "Failed",
      message: "Unauthorized user , No Token",
    });
  }
};

export default checkUserAuth;
