import { Controller, Get, Req } from '@nestjs/common';
import { CheckLogin, GetToken } from 'src/auth/suth.decorator';
import { IndexService } from './index.service';

/**
 * 메인 페이지 Controller 를 구현한 클래스 입니다.
 */
@Controller('index')
export class IndexController {
    constructor(private indexService: IndexService){}

    /**
     * 메인 페이지를 보여주는 API. [Method: GET]
     * @param checkOwner 로그인 유무
     * @param token Jwt 토큰
     * @returns 메인 페이지 html
     */
    @Get('/')
    async firstPage(@CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return await this.indexService.first(checkOwner, token)
    }
}
