import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUserDto';
import { RegisterUserDto } from './dtos/registerUserDto';

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
}
