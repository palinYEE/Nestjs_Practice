import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from 'src/auth/auth.repository';
import { TopicInfo } from 'src/templete/dtos/topicInfo.dto';
import { TempleteService } from 'src/templete/templete.service';
import { topicEntity } from './entity/topic.entity';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
        private templeteService: TempleteService,
        private authRepository: AuthRepository,
        private jwtService: JwtService    
    ){}

    async createPage(checkOwner: Boolean, token: string): Promise<string> {
        const title = 'WEB - create';
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

        const tokenDecode = this.jwtService.decode(token);
        let statusUi = ''
        if(tokenDecode) {
            statusUi = this.templeteService.StatusUI(checkOwner, tokenDecode['displayname']);
        } else {
            statusUi = this.templeteService.StatusUI(checkOwner, '');
        }

        const html = this.templeteService.HTML(title, list, `
            <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
        `, '', statusUi);
        return html;
    }
    async createProcess(topicinfo: TopicInfo, token: string): Promise<topicEntity> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        return await this.topicRepository.createProcess(topicinfo, user);
    }

    async pageId(pageId: number, checkOwner: Boolean, token: string): Promise<string>{
        const topic = await this.topicRepository.pageIdSearch(pageId);
        const title = topic.title;
        const description = topic.description;
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

        const tokenDecode = this.jwtService.decode(token);
        let statusUi = ''
        if(tokenDecode) {
            statusUi = this.templeteService.StatusUI(checkOwner, tokenDecode['displayname']);
        } else {
            statusUi = this.templeteService.StatusUI(checkOwner, '');
        }

        const html = this.templeteService.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `
            <a href="/topic/create">create</a>
            <input type="hidden" name="id" value="${topic.id}">
            <a href="/topic/update/${topic.id}">update</a>
            <form action="/topic/delete_process" method="post">
                        <input type="hidden" name="_method" value="DELETE"/>
                        <input type="hidden" name="id" value="${topic.id}">
                        <input type="submit" value="delete">
                        </form>
            `, statusUi
        );
        return html;
    }

    async deleteProcess(pageId: number, token: string): Promise<void> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        await this.topicRepository.deletePage(pageId, user);
    }

    async updatePageId(pageId: number, checkOwner: Boolean, token: string): Promise<string> {
        const topic = await this.topicRepository.pageIdSearch(pageId);
        const {id, title, description} = topic;
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

        const tokenDecode = this.jwtService.decode(token);
        let statusUi = ''
        if(tokenDecode) {
            statusUi = this.templeteService.StatusUI(checkOwner, tokenDecode['displayname']);
        } else {
            statusUi = this.templeteService.StatusUI(checkOwner, '');
        }

        const html = this.templeteService.HTML(title, list, 
            `
            <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${id}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${id}">update</a>`,statusUi
            );
        return html;
    }

    async updateProcess(pageId: number, topicinfo: TopicInfo, token: string): Promise<void> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        return await this.topicRepository.updatePage(pageId, topicinfo, user);
    }
}
