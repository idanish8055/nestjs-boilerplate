import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import profileConfig from './config/profile.config';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService, 
        UsersCreateManyProvider, 
        CreateUserProvider, 
        FindUserByEmailProvider
    ],
    exports: [UsersService],
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User]),
        ConfigModule.forFeature(profileConfig)
    ]
})
export class UsersModule {}
