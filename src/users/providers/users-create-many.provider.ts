import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersCreateManyProvider {
    constructor(
        /*
        * Injecting Data source 
        */
        private readonly dataSource: DataSource,
        
        @Inject(forwardRef(() => HashingProvider))
        private readonly hashingProvider: HashingProvider
    ){}
    public async createMany(createManyUsersDto: CreateManyUsersDto){
        let newUsers: User[] = [];

        // Create query runner instance
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            // Connect query runner to datasource
            await queryRunner.connect();

            // Start transaction
            await queryRunner.startTransaction();
        } catch (error) {
            throw new RequestTimeoutException('Could not connect to the database');
        }
        
        try {
            for(let user of createManyUsersDto.users){
                let newUser = queryRunner.manager.create(User, {
                    ...user, 
                    password: await this.hashingProvider.hashPassword(user.password)
                });
                let result = await queryRunner.manager.save(newUser);
                newUsers.push(result);
            }
            // If success commit
            await queryRunner.commitTransaction();
        } catch (error) {
            // else rollback
            await queryRunner.rollbackTransaction();
            throw new ConflictException('Could not complete the transaction',{
                description: String(error)
            });
        } finally{
            // Release connection
            try {
                await queryRunner.release();
            } catch (error) {
                throw new RequestTimeoutException('Could not release the connection', {
                    description: String(error)
                });
            }   
        }
        return newUsers;
    }
}
