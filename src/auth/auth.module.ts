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

const jwtConfig = config.get('jwt');

@Module({
  imports: [
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
    AuthService,
    AuthRepository,
    TopicRepository,
    TempleteService,
    CustomJwtStrategy
  ],
  exports:[
    CustomJwtStrategy
    , PassportModule
  ]
})
export class AuthModule {}
