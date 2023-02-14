import { topicEntity } from "src/topic/entity/topic.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class authEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;                         /* 고유 번호 */

    @Column()
    username: string;                   /* 유저 아이디 */

    @Column()
    password: string;                   /* 유저 비밀번호 */

    @Column()
    displayname: string;                /* 화면에 표시할 닉네임 */

    @OneToMany(type => topicEntity, topic => topic.auth, {eager: true})
    topics: topicEntity[]               /* 해당 유저가 만든 게시판 id 리스트 */
}