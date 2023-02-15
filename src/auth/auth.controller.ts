import { Controller, Get, Post, Body, Redirect, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { authDto } from './dtos/auth.dto';
import { GetToken } from './auth.decorator';

/**
 * 로그인, 로그아웃 페이지 생성 및 수행하는 Controller 가 구현되어있는 클래스 입니다.
 */
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    /**
     * 로그인 페이지를 보여주는 API. [Method: GET]
     * @returns 로그인 페이지 html
     */
    @Get('/login')
    async logIn(): Promise<string> {
        return await this.authService.logIn()
    }

    /**
     * 회원가입을 수행할 페이지를 보여주는 API. [Method: GET]
     * @returns 회원가입 페이지 html
     */
    @Get('/register')
    async registerUser(): Promise<string>{
        return await this.authService.registerUser();

    }

    /**
     * db에 회원가입 데이터를 저장하는 API. [Method: POST]
     * @param authdto 아이디, 비밀번호, 입력 확인용 비밀번호, 표시할 이름 데이터가 저장되어있는 dto
     * @returns 'auth_entity' 테이블에 데이터를 저장 후 /index 페이지로 redirect 한다.
     */
    @Post('/register_process')
    @Redirect()
    async registerProcess(@Body(ValidationPipe) authdto: authDto): Promise<{url}> {
        await this.authService.registerProcess(authdto);
        return {url: '/index'}
    }

    /**
     * 로그아웃을 수행하는 함수
     * @param res Response 데이터
     * @returns 쿠키에 저장되어있는 Jwt 토큰을 삭제 후 /index 페이지로 redirect 한다.
     */
    @Get('logout_process')
    @Redirect()
    logoutProcess(@Res() res): {url}{
        res.clearCookie('jwt');
        return {url: '/index'}
    }

    /**
     * 로그인을 수행하는 함수
     * @param res Response 데이터
     * @param username 유저 아이디
     * @param password 유저 비밀번호
     * @returns 로그인 성공시 /index 페이지로, 실패시 /auth/login 페이지로 redirect 시킨다.
     */
    @Post('login_process')
    @Redirect()
    async loginProcess(
        @Res() res,
        @Body('username') username: string, 
        @Body('password') password: string
    ): Promise<{url}> {
        const result = await this.authService.loginProcess(username, password);
        if(result.login_success) {
            res.setHeader('Authorization', 'Bearer '+ result.accessToken);
            res.cookie('jwt',result.accessToken);
            return {url: '/index'};
        } else {
            return {url: `/auth/login`};
        }
    }

    /**
     * UseGuards(AuthGuard()) 테스트용 API
     * @param token Jwt 토큰
     * @returns Jwt 토큰
     */
    @Get('/authTest')
    @UseGuards(AuthGuard())
    test(@GetToken() token: string): string{
        return token;
    }
}
