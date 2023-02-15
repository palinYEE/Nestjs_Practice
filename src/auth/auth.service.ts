import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { AuthRepository } from './auth.repository';
import { authDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * 인증 관련 페이지 및 수행을 제공하는 서비스가 구현된 클래스
 */
@Injectable()
export class AuthService {
    constructor(
        /* Repository 선언 */
        @InjectRepository(TopicRepository)
        @InjectRepository(AuthRepository)
        private topicRepository: TopicRepository,
        private authRepository: AuthRepository,
        /* Service 선언 */
        private jwtService: JwtService,
        private templateService: TempleteService
    ){}

    /**
     * 로그인 페이지 html 을 반환하는 함수
     * @returns 로그인 페이지 html
     */
    async logIn(): Promise<string> {
        const title = 'login';
        const topicList = await this.topicRepository.pageList();
        const list = this.templateService.LIST(topicList);
        const html = this.templateService.HTML(title, list, 
            `
            <form action="/auth/login_process" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p>
                <input type="submit" value="login">
            </p>
            </form>`, '', this.templateService.StatusUiHtml(false, ''));
        return html

    }

    /**
     * 회원가입 페이지 html 을 반환하는 함수
     * @returns 회원가입 페이지 html
     */
    async registerUser(): Promise<string> {
        const title = 'register';
        const topicList = await this.topicRepository.pageList();
        const list = this.templateService.LIST(topicList);
        const html = this.templateService.HTML(title, list, 
            `
            <form action="/auth/register_process" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="compare_password" placeholder="password"></p>
            <p><input type="text" name="displayname" placeholder="display name"></p>
            <p>
                <input type="submit" value="register">
            </p>
            </form>
            `, '', this.templateService.StatusUiHtml(false, '')
            );
        return html
    }

    /**
     * 'auth_entity' 테이블에 유저 데이터를 생성하여 회원가입을 수행하는 함수.
     * @param authdto 아이디, 비밀번호, 입력 확인용 비밀번호, 표시할 이름 데이터가 저장되어있는 dto
     */
    async registerProcess(authdto: authDto): Promise<void> {
        await this.authRepository.createAuth(authdto);
    }

    /**
     * 로그인 인증을 수행하는 함수
     * @param username 유저 아이디
     * @param password 유저 비밀번호 
     * @returns \{성공 유무, 유저 아이디, Jwt 토큰} 을 반환한다.
     */
    async loginProcess(username: string, password: string): Promise<{login_success, username ,accessToken}> {
        const user = await this.authRepository.findOneBy({ username })
        if(user && (await bcrypt.compare(password, user.password))) {
            const payload = { 
                username: username,
                displayname: user.displayname
            };
            const accessToken = await this.jwtService.sign(payload);
            return {
                'login_success': true, 
                'username': username,
                'accessToken':accessToken
            };
        } else {
            return {
                'login_success': false, 
                'username': '',
                'accessToken':''
            };
        }
    }

}