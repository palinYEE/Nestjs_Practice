import { Body, Controller, Delete, Get, Param, Post, Redirect, UseGuards } from '@nestjs/common';
import { TopicInfo } from 'src/templete/dtos/topicInfo.dto';
import { TopicService } from './topic.service';
import { CheckLogin, GetToken } from 'src/auth/suth.decorator';
import * as config from 'config';
import { AuthGuard } from '@nestjs/passport';


@Controller('topic')
@UseGuards(AuthGuard())
export class TopicController {
    constructor(private topicService: TopicService){}

    @Get('/create')
    createPage(@CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.createPage(checkOwner, token);
    }

    @Post('/create_process')
    @Redirect()
    async createProcess(@Body() topicinfo: TopicInfo, @GetToken() token: string) {
        const server = config.get('server');
        const topic = await this.topicService.createProcess(topicinfo, token);
        return {url: `${topic.id}`};
    }

    @Post('/delete_process')
    @Redirect()
    async deleteProcess(@Body('id') id: number, @GetToken() token: string) {
        await this.topicService.deleteProcess(id, token);
        return {url: `/index`};
    }

    @Get('/update/:id')
    updatePage(@Param('id') id: number, @CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.updatePageId(id, checkOwner, token);
    }

    @Post('/update_process')
    @Redirect()
    async updateProcess(@Body('id') id: number, @Body() topicinfo: TopicInfo, @GetToken() token: string): Promise<{url}> {
        await this.topicService.updateProcess(id, topicinfo, token);
        return {url: `/topic/${id}`}
    }

    @Get('/:id')
    async pageId(@Param('id') id: number, @CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.pageId(id, checkOwner, token);
    }

}
