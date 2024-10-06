import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUserDto';
import { RegisterUserDto } from './dtos/registerUserDto';
import { UpdateUserDto } from './dtos/updateUserDto';
import { CheckPermission } from 'src/helpers/checkPermission.helper';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }
    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }
    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
    create(requestBody: RegisterUserDto) {
        const user = this.usersRepository.create(requestBody);
        return this.usersRepository.save(user)
    }
    async updateById(id: number, requestBody: UpdateUserDto, currentUser: User) {
        let user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User does not exist');
        }
        CheckPermission.check(id, currentUser);
        const saltOrRounds = 10;
        const password = requestBody.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        requestBody.password = hash;
        user = { ...user, ...requestBody };

        return this.usersRepository.save(user)
    }
}
