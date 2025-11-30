import { BadRequestException, Body, HttpException, Injectable, RequestTimeoutException } from "@nestjs/common";
import { UsersService } from "src/users/providers/users.service";
import { CreatePostDto } from "../dtos/create-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Posts } from "../posts.entity";
import { MetaOption } from "src/meta-options/entity.meta-option";
import { TagsService } from "src/tags/providers/tags.service";
import { PatchPostDto } from "../dtos/patch-post.dto";
import { Tag } from "src/tags/tag.entity";
import { GetPostsDto } from "../dtos/get-posts.dto";
import { PaginationProvider } from "src/common/pagination/providers/pagination.provider";
import { PaginationQueryDto } from "src/common/pagination/dtos/pagination-query.dto";
import { Paginated } from "src/common/pagination/interfaces/paginated.interface";
import { CreatePostProvider } from "./create-post.provider";
import type { ActiveUserData } from "src/auth/interfaces/active-user-data.interface";

@Injectable()
export class PostsService{
    constructor(
        /* 
        * Injecting user, tags service
        */
        private readonly userService: UsersService,
        private readonly tagsService: TagsService,
        /* 
        * Injecting Post Repository
        */
        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>,
        /* 
        * Injecting MetaOption Repository
        */
        @InjectRepository(MetaOption)
        private readonly metaOptionRepository: Repository<MetaOption>,

        private readonly paginationProvider: PaginationProvider,

        private readonly createPostProvider: CreatePostProvider
    ){}

    /*
    * Creating New Posts 
    */
    public async create(@Body() createPostDto: CreatePostDto, user: ActiveUserData){
        this.createPostProvider.create(createPostDto, user);
    }
    public async findAll(postQuery: GetPostsDto, userId: string): Promise<Paginated<Posts>>{

        let results = this.paginationProvider.paginatedQuery<Posts>(
            {
                limit: postQuery.limit,
                page: postQuery.page
            },this.postRepository);
        return results; 
    }

    public async update(patchPostDto: PatchPostDto){
        if(patchPostDto.tags){
            let tags: Tag[] | null = null;
            let post: Posts | null = null;

            try {
                tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
                
            } catch (error) {
                throw new RequestTimeoutException(
                    'Unable to process this request at the moment', 
                    {
                        description: 'Error connecting to the database'
                    }
                );
            }

            if(!tags || tags.length !== patchPostDto.tags.length){
                throw new BadRequestException(
                    'Please check your tag Ids and make sure they are correct'
                )
            }

            try {
                post = await this.postRepository.findOneBy({
                    id: patchPostDto.id
                });
            } catch (error) {
                throw new RequestTimeoutException(
                    'Unable to process this request at the moment', 
                    {
                        description: 'Error connecting to the database'
                    }
                );
            }

            if(!post){
                throw new BadRequestException('The post Id does not exist');
            }
  
            // update the properties
            post.title = patchPostDto.title ?? post.title;
            post.content = patchPostDto.content ?? post.content;
            post.status = patchPostDto.status ?? post.status;
            post.slug = patchPostDto.slug ?? post.slug;
            post.postType = patchPostDto.postType ?? post.postType;
            post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
            post.publishOn = patchPostDto.publishOn ?? post.publishOn;

            // assign the new tags
            post.tags = tags;

            try {
                await this.postRepository.save(post); 
            } catch (error) {
                throw new RequestTimeoutException(
                    'Unable to process this request at the moment', 
                    {
                        description: 'Error connecting to the database'
                    }
                );
            }
            
            return post;
        }
    }

    public async delete(id: number){
        // find the post
        // let post = await this.postRepository.findOneBy({id});
        // Deleing the post
        // await this.postRepository.delete(id);
        // Deleting the metaOptions
        // if(post){
        //     await this.metaOptionRepository.delete(post?.metaOptions.id);
        // }

        await this.postRepository.delete(id);
        // confirmation
        return {deleted: true, id}
    }
}