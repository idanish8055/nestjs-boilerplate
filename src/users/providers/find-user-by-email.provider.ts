import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByEmailProvider {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    public async findOneByEmail(email: string){
        let user: User | null = null;
        
        try {
            user = await this.userRepository.findOneBy({
                email: email
            });
        } catch (error) {
            throw new RequestTimeoutException(error,
                {
                    description: 'Error while fetching the user'
                }
            );
        }

        if(!user){
            throw new UnauthorizedException('User Not found');
        }
        
        return user;
    }
}
