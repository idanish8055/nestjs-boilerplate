import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {
    constructor(
        /* 
        * Injecting JwtService 
        */
        private readonly jwtService: JwtService,
        /* 
        * Injecting Config as it depends on the JwtService
        */
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}

    public async signToken<T>(userId: number, expiresIn: number, payload?: T){
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, 
        {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: expiresIn
        });

    }

    public async generateToken(user: User){
        const [accessToken, refreshToken] = await Promise.all([
            // access token
            this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {
                email: user.email
            }),
            // refresh token
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl)
        ]);

        return {
            accessToken, 
            refreshToken
        };
    }
}
