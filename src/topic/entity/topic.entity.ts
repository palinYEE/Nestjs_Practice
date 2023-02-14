import { authEntity } from "src/auth/entity/auth.entity";
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class topicEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;                         /* 고유 id */

    @Column()
    title: string;                      /* 게시판 제목 */

    @Column()
    description: string;                /* 게시판 내용 */

    @ManyToOne(type => authEntity, auth => auth.topics, {eager: false})
    auth: authEntity                    /* 게시판을 작성한 사용자 id */
}