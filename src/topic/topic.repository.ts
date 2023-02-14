import { ConsoleLogger, Injectable } from "@nestjs/common";
import { authEntity } from "src/auth/entity/auth.entity";
import { TopicInfo } from "src/templete/dtos/topicInfo.dto";
import { DataSource, Repository } from "typeorm";
import { topicEntity } from "./entity/topic.entity";

/**
 * 'topic_entity' 테이블과 typeORM 을 통해 직접적으로 통신하며, CRUD 를 수행하는 코드가 있는 클래스입니다.
 * 해당 Repository는 authEntity entity 값과 연관있습니다. 
 */
@Injectable()
export class TopicRepository extends Repository<topicEntity> {
    constructor(private dataSource: DataSource) {
        super(topicEntity, dataSource.createEntityManager());
    }

    /**
     * 'topic_entity' 테이블에 데이터를 생성하는 함수
     * @param topicinfo 생성할 데이터 (title, description)
     * @param user 해당 데이터를 만든 유저 데이터
     * @returns 생성한 게시판 데이터
     */
    async createProcess(topicinfo: TopicInfo, user: authEntity): Promise<topicEntity> {
        const {title, description} = topicinfo;
        const topic = new topicEntity();
        topic.title = title;
        topic.description = description;
        topic.auth = user;
        await topic.save();

        return topic;
    }

    /**
     * 'topic_entity' 테이블에서 특정 게시판을 찾는 함수
     * @param id 찾을 게시판의 id
     * @returns 찾은 게시판 데이터
     */
    async pageIdSearch(id: number): Promise<topicEntity> {
        const quary = this.createQueryBuilder('topic_entity');
        quary.where('topic_entity.id = :id', {id: id});
        const topic = await quary.getOne();
        return topic;
    }

    /**
     * 전체 게시판 리스트를 구하는 함수
     * @returns 'topic_entity' 테이블에 저장되어있는 모든 게시판 데이터
     */
    async pageList(): Promise<topicEntity[]> {
        const topics = await this.find();
        return topics
    }

    /**
     * 'topic_entity' 테이블에 저장되어있는 특정 게시판 데이터를 삭제하는 함수
     * @param id 삭제할 게시판 id
     * @param user 삭제하는 유저 데이터
     */
    async deletePage(id: number, user: authEntity): Promise<void> {
        const quary = await this.createQueryBuilder('topic_entity');
        quary.where('topic_entity.id = :id', {id: id});
        quary.andWhere('topic_entity.authId = :userid', {userid: user.id});
        const topic = await quary.getOne();
        if(topic) {
            (await topic).remove();
        }
    }

    /**
     * 'topic_entity' 테이블에 저장되어있는 특정 게시판 데이터를 수정하는 함수
     * @param id 수정할 게시판 id
     * @param topicinfo 수정할 title, description 데이터가 있는 dto
     * @param user 수정하는 유저 데이터
     */
    async updatePage(id: number, topicinfo: TopicInfo, user: authEntity): Promise<void> {
        const quary = await this.createQueryBuilder('topic_entity');
        quary.where('topic_entity.id = :id', {id: id});
        quary.andWhere('topic_entity.authId = :userid', {userid: user.id});
        const topic = await quary.getOne();
        if(topic) {
            topic.title = topicinfo.title;
            topic.description = topicinfo.description;
            await topic.save();
        }
    }
} 