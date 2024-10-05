import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUserDto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { AuthGuard } from 'src/guard/auth.guard';
import { RegisterUserDto } from './dtos/registerUserDto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUserDto';

// request -> middleware -> guard -> interceptor -> response

@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
@Controller('api/v1/user')
export class UserController {

    constructor(private service: UserService, private authService: AuthService) { }

    @UseGuards(AuthGuard)
    @Get()
    getAllUser() {
        return this.service.findAll()
    }
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    GetUser(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }
    // @Post()
    // addUser(@Body() requestBody: CreateUserDto) {
    //     return this.service.create(requestBody);
    // }
    @Post('/register')
    registerUser(@Body() requestBody: RegisterUserDto) {
        return this.authService.register(requestBody)
    }

    @Post('/login')
    loginUser(@Body() requestBody: LoginUserDto) {
        return this.authService.login(requestBody)
    }
}
