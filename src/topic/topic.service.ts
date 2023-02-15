import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from 'src/auth/auth.repository';
import { TopicInfo } from 'src/templete/dtos/topicInfo.dto';
import { TempleteService } from 'src/templete/templete.service';
import { topicEntity } from './entity/topic.entity';
import { TopicRepository } from './topic.repository';

/**
 * 세부 게시판의 CRUD 및 html 생성 서비스가 구현되어있는 클래스입니다.
 */
@Injectable()
export class TopicService {
    constructor(
        /* Repository 선언 */
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
        private authRepository: AuthRepository,
        /* Service 선언 */
        private templeteService: TempleteService,
        private jwtService: JwtService    
    ){}



    /**
     * 게시판을 작성할 html을 생성해주는 함수
     * @param checkOwner 로그인 여부 
     * @param token Jwt 토큰 
     * @returns html string (로그인 X => 최상단 : 'login | Register', 로그인 O => 최상단 : '[닉네임] | logout')
     */
    async createPage(checkOwner: Boolean, token: string): Promise<string> {
        const title = 'WEB - create';
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

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
        `, '', 
        this.templeteService.StatusUiHtml(checkOwner, token));
        return html;
    }

    /**
     * db 에 title, description 데이터를 저장하는 함수
     * @param topicinfo title, description 데이터가 있는 dto 
     * @param token Jwt 토큰
     * @returns 저장한 데이터
     */
    async createProcess(topicinfo: TopicInfo, token: string): Promise<topicEntity> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        return await this.topicRepository.createProcess(topicinfo, user);
    }

    /**
     * 선택한 게시판을 보여줄 html 을 생성하는 함수
     * @param pageId 선택한 게시판 id
     * @param checkOwner 로그인 여부
     * @param token Jwt 토큰
     * @returns 선택한 게시판의 html
     */
    async pageId(pageId: number, checkOwner: Boolean, token: string): Promise<string>{
        const topic = await this.topicRepository.pageIdSearch(pageId);
        const title = topic.title;
        const description = topic.description;
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

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
            `, this.templeteService.StatusUiHtml(checkOwner, token)
        );
        return html;
    }

    /**
     * db에 선택한 게시판 데이터를 삭제하는 함수
     * @param pageId 삭제할 게시판 id
     * @param token Jwt 토큰
     */
    async deleteProcess(pageId: number, token: string): Promise<void> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        await this.topicRepository.deletePage(pageId, user);
    }

    /**
     * 수정할 게시판의 html 을 생성하는 함수
     * @param pageId 수정할 게시판 id
     * @param checkOwner 로그인 여부
     * @param token Jwt 토큰
     * @returns 선택한 게시판의 수정 html 
     */
    async updatePageId(pageId: number, checkOwner: Boolean, token: string): Promise<string> {
        const topic = await this.topicRepository.pageIdSearch(pageId);
        const {id, title, description} = topic;
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

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
            `<a href="/topic/create">create</a> <a href="/topic/update/${id}">update</a>`,this.templeteService.StatusUiHtml(checkOwner, token)
            );
        return html;
    }

    /**
     * db에 게시판 데이터를 수정하는 함수
     * @param pageId 수정할 게시판 id
     * @param topicinfo 수정된 title, description 데이터가 있는 dto
     * @param token Jwt 토큰
     */
    async updateProcess(pageId: number, topicinfo: TopicInfo, token: string): Promise<void> {
        const tokenDecode = this.jwtService.decode(token);
        const username = tokenDecode['username'];
        const user = await this.authRepository.findOneBy({ username })
        await this.topicRepository.updatePage(pageId, topicinfo, user);
    }
}
