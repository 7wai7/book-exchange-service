import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      user?: import("../modules/user/models/user.model").User;
    }
  }
}
