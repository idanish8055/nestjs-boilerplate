import { Injectable } from '@nestjs/common';
import { CreateTagsDto } from '../dtos/CreateTagsDto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';


@Injectable()
export class TagsService {
    constructor(
        /*
        * Inject Tags Repository 
        */
       @InjectRepository(Tag)
       private readonly tagsRepository: Repository<Tag>
    ){}

    public async create(createTagsDto: CreateTagsDto){
        let tag = await this.tagsRepository.create(createTagsDto);
        return await this.tagsRepository.save(tag);
    }

    public async findMultipleTags(tags: number[]){
        let results = await this.tagsRepository.find({
            where: {
                id: In(tags)
            },
        });

        return results;
    }

    public async delete(id: number){
        await this.tagsRepository.delete(id);
        return {deleted: true, id};
    }

    public async softRemove(id: number){
        await this.tagsRepository.softDelete(id);
        return {deleted: true, id}
    }
}
