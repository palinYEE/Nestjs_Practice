import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';

@Injectable()
export class IndexService {
    constructor(
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
        private templeteService: TempleteService,
        private jwtService: JwtService
    ){}

    async first(checkOwner: Boolean, token: string): Promise<string> {
        const title = 'Welcome';
        const description = 'Hello, Nest.Js';
        const topiclist = await this.topicRepository.pageList();
        const list = this.templeteService.LIST(topiclist);

        const tokenDecode = this.jwtService.decode(token);
        let statusUi = '';
        if(tokenDecode != null) {
            statusUi = this.templeteService.StatusUI(checkOwner, tokenDecode['displayname']);
        } else {
            statusUi = this.templeteService.StatusUI(checkOwner, '');
        }
        const html = this.templeteService.HTML(title, list, `<h2>${title}</h2>${description}`,`<a href="/topic/create">create</a>`, statusUi);    
        return html;
    }
}
