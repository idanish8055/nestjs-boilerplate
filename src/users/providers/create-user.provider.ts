import { Injectable, BadRequestException, HttpException, RequestTimeoutException, Inject, forwardRef } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
    constructor(
        /*
        * Injecting User Repository 
        */
        @InjectRepository(User)
        private usersRepository:Repository<User>,

        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ){}
    public async createUser(createUserDto: CreateUserDto){
        let existingUser: User | null = null;

        try {
            existingUser = await this.usersRepository.findOne({
                where: {email: createUserDto.email}
            });
            if(existingUser){
                throw new BadRequestException(
                    'The user already exist with this email.',
                )
            }
            else{
                let newUser = await this.usersRepository.create({
                    ...createUserDto,
                    password: await this.hashingProvider.hashPassword(createUserDto.password)
                });
                
                newUser = await this.usersRepository.save(newUser);
                return newUser;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new RequestTimeoutException(
                'Unable to process this request at the moment', 
                {
                    description: 'Error connecting to the database'
                }
            );
        }
    }
}
