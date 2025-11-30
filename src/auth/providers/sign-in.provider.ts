import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly hashingProvider: HashingProvider,
        private readonly generateTokensProvider: GenerateTokensProvider
    ){}
    public async signIn(signInDto: SignInDto){
        let user = await this.usersService.findOneByEmail(signInDto.email);
        
        let isEqual: boolean = false;

        try {
            isEqual = await this.hashingProvider.comparePassword(
                signInDto.password, 
                user.password
            );
        } catch (error) {
            throw new RequestTimeoutException(error, {
                description: 'Could not compare the password'
            });
        }

        if(!isEqual){
            throw new UnauthorizedException('Incorrect password');
        }
        
        return await this.generateTokensProvider.generateToken(user);
    }
}
