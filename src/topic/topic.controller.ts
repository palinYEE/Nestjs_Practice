import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Redirect, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TopicInfo } from 'src/templete/dtos/topicInfo.dto';
import { TopicService } from './topic.service';
import { CheckLogin, GetToken } from 'src/auth/auth.decorator';
import * as config from 'config';
import { AuthGuard } from '@nestjs/passport';

/**
 * 세부 게시판들에 대한 CRUD Controller 가 있는 클래스 입니다. 
 * 해당 API를 사용하기 위해서는 로그인을 통해 쿠키에 Jwt 토큰이 저장되어있어야 합니다.
 */
@Controller('topic')
@UseGuards(AuthGuard())
export class TopicController {
    constructor(private topicService: TopicService){}

    /**
     * topic 게시판을 페이지를 보여주는 API. [Method: GET]
     * @param checkOwner 현재 사용자가 로그인 여부 정보를 가지고 있다. 이는 `CheckLogin()` 데코레이터를 사용한다.
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns topic title, description 정보를 넣을 수 있는 html string
     */
    @Get('/create')
    createPage(@CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.createPage(checkOwner, token);
    }

    /**
     * topic 게시판을 생성 및 저장을 하는 API. [Method: POST]
     * @param topicinfo title, description 정보가 있는 dto. 해당 데이터는 request 의 body 를 통해 전달된다.
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns db에 데이터를 저장하고 해당 topic 페이지로 redirect 한다.
     */
    @Post('/create_process')
    @UsePipes(ValidationPipe)
    @Redirect()
    async createProcess(@Body() topicinfo: TopicInfo, @GetToken() token: string) {
        const server = config.get('server');
        const topic = await this.topicService.createProcess(topicinfo, token);
        return {url: `${topic.id}`};
    }

    /**
     * topic 게시판을 지우는 API. [Method: POST]
     * @param id 지울 게시판 id. 해당 데이터는 request의 body 에 있는 id 값을 통해 전달 받는다. 
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns 해당 데이터를 삭제 후 /index 페이지로 redirext 한다.
     */
    @Post('/delete_process')
    @Redirect()
    async deleteProcess(@Body('id', ParseIntPipe) id: number, @GetToken() token: string) {
        await this.topicService.deleteProcess(id, token);
        return {url: `/index`};
    }

    /**
     * 선택한 게시판의 내용을 수정할 페이지를 보여주는 API. [Method: GET]
     * @param id 수정할 페이지 id. 해당 데이터는 request의 body 에 있는 id 값을 통해 전달 받는다. 
     * @param checkOwner 현재 사용자가 로그인 여부 정보를 가지고 있다. 이는 `CheckLogin()` 데코레이터를 사용한다.
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns topic title, description 정보를 수정할 수 있는 html string
     */
    @Get('/update/:id')
    updatePage(@Param('id', ParseIntPipe) id: number, @CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.updatePageId(id, checkOwner, token);
    }

    /**
     * 선택한 게시판의 데이터를 수정하는 API. [Method: POST]
     * @param id 수정할 페이지 id. 해당 데이터는 request의 body 에 있는 id 값을 통해 전달 받는다. 
     * @param topicinfo title, description 정보가 있는 dto. 해당 데이터는 request 의 body 를 통해 전달된다.
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns 해당 데이터를 수정한 후 해당 topic 게시판으로 redirect 한다.
     */
    @Post('/update_process')
    @UsePipes(ValidationPipe)
    @Redirect()
    async updateProcess(@Body('id',ParseIntPipe) id: number, @Body() topicinfo: TopicInfo, @GetToken() token: string): Promise<{url}> {
        await this.topicService.updateProcess(id, topicinfo, token);
        return {url: `/topic/${id}`}
    }

    /**
     * 선택한 게시판을 보여주는 API. [Method: GET]
     * @param id 선택한 페이지 id. 해당 데이터는 request의 body 에 있는 id 값을 통해 전달 받는다. 
     * @param checkOwner 현재 사용자가 로그인 여부 정보를 가지고 있다. 이는 `CheckLogin()` 데코레이터를 사용한다.
     * @param token 쿠키에 저장되어있는 토큰 정보를 가지고 있다. 이는 `GetToken()` 데코레이터를 사용하여 토큰 정보를 불러온다.
     * @returns topic title, description 정보를 볼 수 있는 html string
     */
    @Get('/:id')
    async pageId(@Param('id') id: number, @CheckLogin() checkOwner: Boolean, @GetToken() token: string): Promise<string> {
        return this.topicService.pageId(id, checkOwner, token);
    }

}
