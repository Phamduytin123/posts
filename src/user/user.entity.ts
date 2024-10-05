import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

enum ROLES {
    ADMIN = 'ADMIN',
    MOD = 'MOD',
    USER = 'USER',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column({ default: true })
    isActive: boolean;

    @Column({ default: ROLES.USER })
    role: ROLES;
}