import { Controller, Get, Param, Post, Body, Patch, Delete, Query, ParseIntPipe, Req } from "@nestjs/common";
import { PostsService } from "./providers/posts.service";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PatchPostDto } from "./dtos/patch-post.dto";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { ActiveUser } from "src/auth/decorator/active-user.decorator";

@Controller('posts')
@ApiTags('Posts')
export class PostsController{
    constructor(private readonly postsService: PostsService){}

    /* 
    * GET http://localhost:3000/posts/:id 
    */

    @Get('{/:userId}')
    public getPosts(
        @Param('userId') userId: string,
        @Query() postQuery: GetPostsDto
    ){
        return this.postsService.findAll(postQuery, userId);
    }

    @ApiOperation({
        summary: "Creates a new post"
    })
    @ApiResponse({
        status: 201,
        description: "You get a 201 response if the post created successfully"
    })
    @Post()
    public async createPost(
        @Body() createPostDto: CreatePostDto, 
        @ActiveUser() user){
        return this.postsService.create(createPostDto, user);
    }

    @ApiOperation({
        summary: "Update an existing post"
    })
    @ApiResponse({
        status: 201,
        description: "You get a 200 response if the post updated successfully"
    })
    @Patch()
    public updatePost(@Body() patchPostDto: PatchPostDto){
        return this.postsService.update(patchPostDto);
    }

    @ApiOperation({
        summary: "Delete an existing post"
    })
    @ApiResponse({
        status: 200,
        description: "You get a 200 response if the post deleted successfully"
    })
    @Delete()
    public deletePost(@Query('id', ParseIntPipe) id: number){
        return this.postsService.delete(id);
    }
}