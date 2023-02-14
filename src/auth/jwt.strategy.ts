import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthRepository } from "./auth.repository";
import * as config from 'config';
import { Injectable, UnauthorizedException } from "@nestjs/common";

let cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'] || req.header;
    }
    return token;
};

@Injectable()
export class CustomJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ){
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            ignoreExpiration: false,
            jwtFromRequest: cookieExtractor
        })
    }

    async validate(payload){
        const { username, displayname } = payload;
        const user = await this.authRepository.findOneBy({username});

        if(!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}