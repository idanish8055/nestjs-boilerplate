import { postStatus } from '../enums/post-status.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested
} from 'class-validator';
import { postType as PostType } from '../enums/post-type.enum';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/createPost-metaOptions.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({
        default: "This is a title"
    })
    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    @MaxLength(512)
    title: string;

    @ApiProperty({
        enum: PostType,
        description: "Possible values: post, page, story, series"
    })
    @IsEnum(PostType)
    @IsNotEmpty()
    postType: PostType;

    @ApiProperty({
        description: "For example - 'my-url'",
        default: "my-nestjs-blog-post"
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
        'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
    })
    @MaxLength(256)
    slug: string;

    @ApiProperty({
        enum: postStatus,
        description: "Possible values: draft, scheduled, review, published"
    })
    @IsEnum(postStatus)
    @IsNotEmpty()
    status: postStatus;

    @ApiPropertyOptional({
        description: "This is the content of the Post",
        default: "The post content"
    })
    @IsOptional()
    @IsString()
    content: string;

    @ApiPropertyOptional({
        description: "Serialize your JSON else validation error will be thrown",
        default: "{\r\n    \"@context\": \"https:\/\/schema.org\",\r\n    \"@type\": \"Person\"\r\n  }"
    })
    @IsOptional()
    @IsJSON()
    schema: string;

    @ApiPropertyOptional({
        description: "Featured Image of your post",
        default: "https://example.com/cdn/1234/12/featured-image.jpeg"
    })
    @IsOptional()
    @IsUrl()
    featuredImageUrl: string;

    @ApiPropertyOptional({
        description: "The date on which your post is published",
        default: "2024-03-16T07:46:32+0000"
    })
    @IsOptional()
    publishOn: Date;

    @ApiPropertyOptional({
        description: "Array of ids of tags",
        default: [1, 2]
    })
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    tags: number[];

    @ApiPropertyOptional({
        type: 'object',
        default: null,
        properties:{
            metaValue:{
                type: 'string',
                description: 'The metaValue is a JSON string',
                example: '{"SidebarEnabled": true}'
            }
        }
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreatePostMetaOptionsDto)
    metaOptions: CreatePostMetaOptionsDto;

    // @ApiProperty({
    //     type: 'number',
    //     required: true,
    //     description: 'ID of the Author',
    //     example: 1
    // })
    // @IsInt()
    // @IsNotEmpty()
    // authorId: number;
}