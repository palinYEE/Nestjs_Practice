import { ConsoleLogger, Injectable } from "@nestjs/common";
import { authEntity } from "src/auth/entity/auth.entity";
import { TopicInfo } from "src/templete/dtos/topicInfo.dto";
import { DataSource, Repository } from "typeorm";
import { topicEntity } from "./entity/topic.entity";

@Injectable()
export class TopicRepository extends Repository<topicEntity> {
    constructor(private dataSource: DataSource) {
        super(topicEntity, dataSource.createEntityManager());
    }

    async createProcess(topicinfo: TopicInfo, user: authEntity): Promise<topicEntity> {
        const {title, description} = topicinfo;
        const topic = new topicEntity();
        topic.title = title;
        topic.description = description;
        topic.auth = user;
        await topic.save();

        return topic;
    }

    async pageIdSearch(id: number): Promise<topicEntity> {
        const quary = this.createQueryBuilder('topic_entity');
        quary.where('topic_entity.id = :id', {id: id});
        const topic = await quary.getOne();
        return topic;
    }

    async pageList(): Promise<topicEntity[]> {
        const topics = await this.find();
        return topics
    }

    async deletePage(id: number, user: authEntity): Promise<void> {
        const quary = await this.createQueryBuilder('topic_entity');
        quary.where('topic_entity.id = :id', {id: id});
        quary.andWhere('topic_entity.authId = :userid', {userid: user.id});
        const topic = await quary.getOne();
        if(topic) {
            (await topic).remove();
        }
    }

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