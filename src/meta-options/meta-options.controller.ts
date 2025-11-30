import { Controller, Post, Body, Inject } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/createPost-metaOptions.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
    constructor(
        /*
        * Injecting MetaOptions 
        */
       
       private readonly metaOptionsService: MetaOptionsService
    ){}

    @Post()
    create(@Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto){
        return this.metaOptionsService.create(createPostMetaOptionsDto);
    }
}
