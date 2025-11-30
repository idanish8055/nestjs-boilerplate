import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { postStatus } from "./enums/post-status.enum";
import { postType } from "./enums/post-type.enum";
import { CreatePostMetaOptionsDto } from "../meta-options/dtos/createPost-metaOptions.dto";
import { MetaOption } from "src/meta-options/entity.meta-option";
import { User } from "src/users/user.entity";
import { Tag } from "src/tags/tag.entity";

@Entity()
export class Posts{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 512,
        nullable: false
    })
    title: string;

    @Column({
        type: 'enum',
        enum: postType,
        nullable: false,
        default: postType.POST
    })
    postType: postType;

    @Column({
        type: 'varchar',
        length: 256,
        nullable: false,
        unique: true
    })
    slug: string;

    @Column({
        type: 'enum',
        nullable: false,
        enum: postStatus,
        default: postStatus.DRAFT
    })
    status: postStatus;

    @Column({
        type: 'text',
        nullable: true
    })
    content: string;

    @Column({
        type: 'text',
        nullable: true
    })
    schema: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: true
    })
    featuredImageUrl: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    publishOn: Date;

    @OneToOne(()=>MetaOption,
    (metaOptions)=> metaOptions.post, 
    {
        cascade: true,
        eager: true
    })
    metaOptions: MetaOption;

    @ManyToOne(() => User, (user) => user.posts, {
        eager: true
    })
    author: User;

    @ManyToMany(() => Tag, (tag) => {tag.posts},{
        eager: true
    })
    @JoinTable()
    tags: Tag[];
}