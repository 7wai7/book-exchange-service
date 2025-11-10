import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
    tokenAge = 1000 * 60 * 60 * 24;

    register = async (req: Request, res: Response) => {
        const { token, user } = await authService.register(req.body);
        this.saveCookieToken(res, token);
        return res.json(user);
    }

    login = async (req: Request, res: Response) => {
        const { token, user } = await authService.login(req.body);
        this.saveCookieToken(res, token);
        return res.json(user);
    }

    saveCookieToken = (res: Response, token: string) => {
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript access
            secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: this.tokenAge // Cookie expiration in milliseconds (e.g., 1 hour)
        });
    }
}

export const authController = new AuthController();