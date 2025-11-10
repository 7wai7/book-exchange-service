import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { User } from "../user/models/user.model";
dotenv.config();

const {
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_PORT,
    DB_NAME
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        sequelize.addModels([User]);
        
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default sequelize;