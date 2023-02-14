import { Controller, Get, Post, Body, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { authDto } from './dtos/auth.dto';
import { GetToken } from './suth.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Get('/login')
    async logIn(): Promise<string> {
        return await this.authService.logIn()
    }

    @Get('/register')
    async registerUser(): Promise<string>{
        return await this.authService.registerUser();

    }

    @Post('/register_process')
    @Redirect()
    async registerProcess(@Body() authdto: authDto): Promise<{url}> {
        await this.authService.registerProcess(authdto);
        return {url: '/index'}
    }

    @Get('logout_process')
    @Redirect()
    logoutProcess(@Res() res) {
        res.clearCookie('jwt');
        return {url: '/index'}
    }

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

    @Get('/authTest')
    @UseGuards(AuthGuard())
    test(@GetToken() token: string){
        return token;
    }
}
