import { ENUM } from "sequelize";

export enum Role {
    USER = "user",
    ADMIN = "admin"
}

export const RoleEnum = ENUM(...Object.values(Role))