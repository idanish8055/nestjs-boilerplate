import { Controller, Post, Body, Query, ParseIntPipe, Delete } from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagsDto } from './dtos/CreateTagsDto';

@Controller('tags')
export class TagsController {
    constructor(
        /*
        * Inject Tags Service
        */
       private readonly tagsService: TagsService
    ){}

    @Post()
    public createTags(@Body() createTagsDto: CreateTagsDto){
        return this.tagsService.create(createTagsDto);
    }

    @Delete()
    public deleteTags(@Query('id', ParseIntPipe) id: number){
        return this.tagsService.delete(id);
    }

    @Delete('soft-delete')
    public softDelete(@Query('id', ParseIntPipe) id: number){
        return this.tagsService.softRemove(id);
    }
}
