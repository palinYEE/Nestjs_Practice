import { Injectable } from '@nestjs/common';
import { topicEntity } from 'src/topic/entity/topic.entity';

@Injectable()
export class TempleteService {
    HTML(title: string ,list: string,body: string ,control: string ,authStatusUI: string): string{
            return `
            <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              ${authStatusUI}
              <h1><a href="/index">WEB</a></h1>
              ${list}
              ${control}
              ${body}
            </body>
            </html>
            `;
    }

    LIST(topicList: topicEntity[]): string {
        var list = '<ul>';
        var i = 0;
        while(i < topicList.length){
          list = list + `<li><a href="/topic/${topicList[i].id}">${topicList[i].title}</a></li>`;
          i = i + 1;
        }
        list = list+'</ul>';
        return list;
    }

    StatusUI(checkOwner: Boolean, user: string){
      var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
      if(checkOwner) {
          authStatusUI = `${user} | <a href="/auth/logout_process">logout</a>`
      }
      return authStatusUI;
  }
}
