import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';

/**
 * 메인 페이지를 만드는 서비스를 제공하는 클래스입니다.
 */
@Injectable()
export class IndexService {
    constructor(
        /* Repository 선언 */
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
        /* Service 선언 */
        private templeteService: TempleteService,
    ){}

    /**
     * 메인 페이지 html 을 반환하는 함수
     * @param checkOwner 로그인 여부
     * @param token Jwt 토큰
     * @returns 메인 페이지 html
     */
    async first(checkOwner: Boolean, token: string): Promise<string> {
        const title = 'Welcome';
        const description = 'Hello, Nest.Js';
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

        const html = this.templeteService.HTML(title, list, `<h2>${title}</h2>${description}`,`<a href="/topic/create">create</a>`, this.templeteService.StatusUiHtml(checkOwner, token));    
        return html;
    }
}
