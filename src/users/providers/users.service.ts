import { Injectable, Inject, forwardRef, RequestTimeoutException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { GetUserParamsDTO } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigService, type ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { CreateUserProvider } from "./create-user.provider";
import { FindUserByEmailProvider } from "./find-user-by-email.provider";

/*
 * Class to connect Users table and perform some business operations
 */
@Injectable()
export class UsersService{
    
    constructor(
        /*
        * Injecting AuthService 
        */
       @Inject(forwardRef(()=>AuthService))
       private readonly authService: AuthService,
       /*
        * Injecting User Repository 
        */
       @InjectRepository(User)
       private usersRepository:Repository<User>,
       /*
        * Injecting Config Service 
        */
       private readonly configService: ConfigService,

       /*
        * Injecting Data source 
        */
       @Inject(profileConfig.KEY)
       private readonly profileConfiguration: ConfigType<typeof profileConfig>,

        /*
        * Injecting Data source 
        */
        private readonly dataSource: DataSource,

        /*
        * Injecting CreateManyUsersProvider 
        */
        private readonly usersCreateManyProvider: UsersCreateManyProvider,

        /*
        * Create User Provider
        */
        @Inject(forwardRef(()=> CreateUserProvider))
        private readonly createUserProvider: CreateUserProvider,

        private readonly findUserByEmailProvider: FindUserByEmailProvider
    ){}
    
    public createUser(createUserDto: CreateUserDto){
        return this.createUserProvider.createUser(createUserDto);
    }
    /** 
    * Method to get all users from the database
    */
    public findAll(
        getUserParamsDTO: GetUserParamsDTO, 
        limit: number,
        page: number
    ){
        throw new HttpException({
                status: HttpStatus.MOVED_PERMANENTLY,
                error: 'The API endpoint does not exist.',
                fileName: 'users.service.ts',
                lineNumber: 70
            }, 
            HttpStatus.MOVED_PERMANENTLY,
            {
                cause: new Error(),
                description: 'Occured because the API endpoint moved permanently.'
            }
        );
    }

    /**
    * Find a single User by using the Id
    */
    public async findOneById(id: number){
        let user: User | null = null;
        try {
            user = await this.usersRepository.findOneBy({id});
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

        if(!user){
            throw new BadRequestException('The user id does not exist');
        }

        return user;
    }

    public findOneByEmail(email: string){
        return this.findUserByEmailProvider.findOneByEmail(email);
    }

    public async createMany(createManyUsersDto: CreateManyUsersDto){
        return await this.usersCreateManyProvider.createMany(createManyUsersDto);
    }
}