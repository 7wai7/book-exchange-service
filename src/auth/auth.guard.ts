import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userService } from '../user/user.service';
dotenv.config();

// isHardGuard === false -- залишити доступ неаторизованим користувачам но з меншим функціоналом
export default function authGuard(isHardGuard = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.token;
        if (!token) {
            if (isHardGuard) throw new Error("Unauthorized");
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await userService.findOne({ id: (decoded as any).id })
        if (!user) {
            if (isHardGuard) throw new Error("Unauthorized");
            return next();
        }

        req.user = user;
        next();
    };
}