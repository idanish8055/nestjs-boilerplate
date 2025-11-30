import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Put, 
    Param, 
    Query, 
    Body, 
    Headers, 
    Ip, 
    ParseIntPipe, 
    DefaultValuePipe,
    ValidationPipe,
    Request,
    Inject,
    forwardRef,
    UseGuards,
    SetMetadata,
    UseInterceptors,
    ClassSerializerInterceptor
} from "@nestjs/common";

// import { Request } from "express";
import { CreateUserDto } from "./dtos/create-user.dto";
import { GetUserParamsDTO } from "./dtos/get-users-param.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UsersService } from "./providers/users.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateManyUsersDto } from "./dtos/create-many-users.dto";
import { CreateUserProvider } from "./providers/create-user.provider";
import { AccessTokenGuard } from "src/auth/guards/access-token/access-token.guard";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { Auth } from "src/auth/decorator/auth.decorator";

@Controller('users')
@ApiTags('Users')
export class UsersController{
    //injecting Users service
    constructor(
        private readonly userService: UsersService,
        @Inject(forwardRef(()=> CreateUserProvider))
        private readonly createUserProvider: CreateUserProvider
    ){}

    @Get('{/:id}')
    @ApiOperation({
        summary: 'Fetches the list of registered users on the application',
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of entries returned per query',
        example: 10
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        description: 'The position of the page that you want the API to returned',
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Users fetched successfully!'
    })
    @UseInterceptors(ClassSerializerInterceptor)
    public getUsers(
        @Param() getUserParamsDTO: GetUserParamsDTO, 
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number){

        return this.userService.findAll(getUserParamsDTO, limit, page);
    }

    @Post()
    // @SetMetadata('authType', 'none') 
    @UseInterceptors(ClassSerializerInterceptor)
    @Auth(AuthType.None, AuthType.Bearer)
    public createUsers(@Body() createUserDto: CreateUserDto){
        return this.userService.createUser(createUserDto);
    }

    @Post('create-many')
    public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto){
        return this.userService.createMany(createManyUsersDto);
    }

    @Patch()
    public patchUsers(@Body() patchUserDto: PatchUserDto){
        return patchUserDto;
    }
}