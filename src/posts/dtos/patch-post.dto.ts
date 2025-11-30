import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreatePostDto } from "./create-post.dto";

export class PatchPostDto extends PartialType(CreatePostDto){
    @ApiProperty({
        description: "The ID of the post that need to be updated",
        default: 1234
    })
    @IsInt()
    @IsNotEmpty()
    id: number;
}