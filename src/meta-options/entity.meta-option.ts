import { Posts } from "src/posts/posts.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MetaOption{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'json',
        nullable: false
    })
    metaValue: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

    @OneToOne(() => Posts, (post) => post.metaOptions, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    post: Posts;
}