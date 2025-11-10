import { Max, MaxLength, Min, MinLength } from "class-validator";

export default class LoginDto {
    @MinLength(3)
    @MaxLength(24)
    username!: string;

    @MinLength(3)
    @MaxLength(24)
    password!: string;
}