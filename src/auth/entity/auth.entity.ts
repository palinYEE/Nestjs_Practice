import { topicEntity } from "src/topic/entity/topic.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class authEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    displayname: string;

    @OneToMany(type => topicEntity, topic => topic.auth, {eager: true})
    topics: topicEntity[]
}