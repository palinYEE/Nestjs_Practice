import { Controller, Get, Req } from '@nestjs/common';
import { CheckLogin, GetToken } from 'src/auth/suth.decorator';
import { IndexService } from './index.service';

@Controller('index')
export class IndexController {
    constructor(private indexService: IndexService){}

    @Get('/')
    async firstPage(@CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return await this.indexService.first(checkOwner, token)
    }
}
