import { IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUserParamsDTO{
    @ApiPropertyOptional({
        description: 'Get user with a specific id',
        example: 1234,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number) //type conversion from string to number using transformer class
    id?: number;
}