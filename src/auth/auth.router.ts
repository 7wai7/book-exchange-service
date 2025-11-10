import { Router, Request, Response } from "express";
import { authController } from "./auth.controller";
import { validationMiddleware } from "../middlewares/validation.middleware";
import RegisterDto from "./dto/register.dto";
import LoginDto from "./dto/login.dto";

const authRouter = Router();

authRouter.post("/register", validationMiddleware(RegisterDto), authController.register);
authRouter.post("/login", validationMiddleware(LoginDto), authController.login);

export default authRouter;