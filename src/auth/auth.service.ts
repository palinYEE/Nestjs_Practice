import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { AuthRepository } from './auth.repository';
import { authDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(TopicRepository)
        private topicRepository: TopicRepository,
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService,
        private templateService: TempleteService
    ){}

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
            </form>`, '', '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>');
        return html

    }

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
            `, '', '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'
            );
        return html
    }

    async registerProcess(authdto: authDto): Promise<void> {
        return await this.authRepository.createAuth(authdto);
    }

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