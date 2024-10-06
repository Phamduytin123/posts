import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { AuthGuard } from 'src/guard/auth.guard';
import { RegisterUserDto } from './dtos/registerUserDto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUserDto';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { User } from './user.entity';
import { RoleGuard } from 'src/guard/role.guard';
import { UpdateUserDto } from './dtos/updateUserDto';

// request -> middleware -> guard -> interceptor -> response

@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
@Controller('api/v1/user')
export class UserController {

    constructor(private service: UserService, private authService: AuthService) { }
    @Get('/profile')
    @UseGuards(AuthGuard)
    getProfile(@CurrentUser() currentUser: User) {
        return currentUser;
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
    // @UseGuards(AuthGuard)


    @Post('/register')
    registerUser(@Body() requestBody: RegisterUserDto) {
        return this.authService.register(requestBody)
    }

    @Post('/login')
    loginUser(@Body() requestBody: LoginUserDto) {
        return this.authService.login(requestBody)
    }
    @Put('/update/:id')
    @UseGuards(AuthGuard)
    updateUserbyId(@Param('id', ParseIntPipe) id: number, @Body() requestBody: UpdateUserDto, @CurrentUser() currentUser: User) {
        return this.service.updateById(id, requestBody, currentUser);
    }
    @Get()
    @UseGuards(new RoleGuard(["admin", "user"]))
    @UseGuards(AuthGuard)
    getAllUser(@Request() req) {
        console.log(req.currentUser);
        return this.service.findAll()
    }


}
