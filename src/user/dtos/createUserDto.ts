import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    firstName: string;

    @IsEmail()
    lastName: string;

    @IsNotEmpty()
    isActive: boolean;
}