import { Injectable } from '@nestjs/common';
import { topicEntity } from 'src/topic/entity/topic.entity';

/**
 * html 을 생성하는 서비스를 제공하는 클래스입니다.
 */
@Injectable()
export class TempleteService {
  /**
   * 프로젝트의 html틀을 셋팅하고 입력 인자들을 통해 원하는 페이지의 html 을 반환하는 함수입니다.
   * @param title 제목
   * @param list 게시판 목록
   * @param body 본문 
   * @param control 생성, 업데이트, 삭제 버튼 html
   * @param authStatusUI 로그인 또는 로그아웃 html 
   * @returns 원하는 페이지의 html
   */
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

    /**
     * 게시판 리스트를 보여줄 html 을 반환하는 함수
     * @param topicList 게시판 정보가 들어있는 리스트
     * @returns 게시판 정보 list를 보여주는 html
     */
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

    /**
     * 로그인 유무를 통해 최상단에 표시할 html 을 반환하는 함수
     * @param checkOwner 로그인 유무
     * @param user 사용자 정보
     * @returns 최상단에 표시할 로그인 상태 html
     */
    StatusUI(checkOwner: Boolean, user: string){
      var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
      if(checkOwner) {
          authStatusUI = `${user} | <a href="/auth/logout_process">logout</a>`
      }
      return authStatusUI;
  }
}
