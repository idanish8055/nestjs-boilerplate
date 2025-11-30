import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateManyUsersDto {
    @ApiProperty({
        type: 'array',
        required: true,
        items: {
            type: 'User'
        },
        description: 'Array of users to create',
    })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: CreateUserDto[];
}