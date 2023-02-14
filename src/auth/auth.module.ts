import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import * as config from 'config';
import { CustomJwtStrategy } from 'src/auth/jwt.strategy';

const jwtConfig = config.get('jwt');          /* jwt config load */

/**
 * AuthModule은 로그인을 위한 인증 및 db 저장을 수행하는 모듈입니다.
 */
@Module({
  imports: [
    /* jwt register setting */
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions:{
        expiresIn: jwtConfig.expiresIn
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    /* Service Provider Setting */
    AuthService,
    TempleteService,
    /* Repository Provider Setting */
    AuthRepository,
    TopicRepository,
    /* JwtStrategy Setting */
    CustomJwtStrategy
  ],
  exports:[
    /* Jwt Setting */
    CustomJwtStrategy
    , PassportModule
  ]
})
export class AuthModule {}
