import express from "express";
import UserController from "../controller/user.controller.js";
import checkUserAuth from "../middlewares/auth-middleware.js";
const router = express.Router();

// ROUTE LEVEL MIDDLEWARE  - TO PROTECT ROUTE
router.use("/changepassword", checkUserAuth);

// PUBLIC ROUTES
router.post("/register", UserController.userRegisteration);
router.post("/login", UserController.userLogin);
router.post("/changepassword", UserController.changeUserPassword);

//PRIVATE ROUTES
export default router;
