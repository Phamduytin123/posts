import { BadRequestException, Injectable, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterUserDto } from "./dtos/registerUserDto";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dtos/loginUserDto";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }
    async register(requestBody: RegisterUserDto) {
        //check email exist
        const userByEmail = await this.userService.findByEmail(requestBody.email);
        if (userByEmail) {
            throw new BadRequestException('Email already exist !');
        }

        //hash password
        const saltOrRounds = 10;
        const password = requestBody.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        requestBody.password = hash;
        //save to db
        const saveUser = await this.userService.create(requestBody);

        //generate jwt token
        const payload = {
            id: saveUser.id,
            firstName: saveUser.firstName,
            lastName: saveUser.lastName,
            role: saveUser.role
        };

        const acess_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,

        })

        return {
            msg: 'User has been created!',
            acess_token,
        }
    }

    async login(requestBody: LoginUserDto) {
        //check email exist
        const userByEmail = await this.userService.findByEmail(requestBody.email);
        if (!userByEmail) {
            throw new BadRequestException('Invalid Credentials!');
        }

        //check password 
        const isMatchPassword = await bcrypt.compare(requestBody.password, userByEmail.password);
        if (!isMatchPassword) {
            throw new BadRequestException('Invalid Credentials!');
        }
        //generate jwt token
        const payload = {
            id: userByEmail.id,
            firstName: userByEmail.firstName,
            lastName: userByEmail.lastName,
            email: userByEmail.email,
            role: userByEmail.role
        };

        const acess_token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,

        })

        return {
            msg: 'User has been login successfully!',
            acess_token,
        }
    }
}