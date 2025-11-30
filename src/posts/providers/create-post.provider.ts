import { BadRequestException, Body, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { Repository } from 'typeorm';
import { Posts } from '../posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
    constructor(
        private readonly userService: UsersService,
        private readonly tagsService: TagsService,

        @InjectRepository(Posts)
        private readonly postRepository: Repository<Posts>
    ){}
    public async create(@Body() createPostDto: CreatePostDto, user: ActiveUserData){
        let author: User | null;
        let tags: Tag[] | null;

        try {
            author = await this.userService.findOneById(user.sub);
            tags = await this.tagsService.findMultipleTags(createPostDto.tags);
        } catch (error) {
            throw new ConflictException(error);
        }

        if(createPostDto.tags.length !== tags.length){
            throw new BadRequestException('Please check your tag Ids');
        }

        let post = this.postRepository.create({
            ...createPostDto, 
            author: author,
            tags
        });

        try {
            return await this.postRepository.save(post);
        } catch (error) {
            throw new ConflictException(error, {
                description: 'Ensure post slug is unique and not a duplicate'
            });
        }
        
    }
}
