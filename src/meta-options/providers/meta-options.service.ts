import { Injectable } from "@nestjs/common";
import { CreatePostMetaOptionsDto } from "../dtos/createPost-metaOptions.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MetaOption } from "../entity.meta-option";
import { Repository } from "typeorm";

@Injectable()
export class MetaOptionsService{
    constructor(
        /*
        * Injecting MetaOption Repository 
        */
       @InjectRepository(MetaOption) 
       private readonly metaOptionRepository: Repository<MetaOption>
    ){}

    public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto){
        let metaOption = this.metaOptionRepository.create(createPostMetaOptionsDto);
        return await this.metaOptionRepository.save(metaOption);
    }
}