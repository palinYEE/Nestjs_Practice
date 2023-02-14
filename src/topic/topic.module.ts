import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { TempleteService } from 'src/templete/templete.service';
import { TopicController } from './topic.controller';
import { TopicRepository } from './topic.repository';
import { TopicService } from './topic.service';

@Module({
  imports:[
    AuthModule                      /* 로그인 인증에 사용하는 커스텀 모듈 */
  ],
  controllers: [TopicController],   
  providers: [
    /* Service Provider Setting */
    TopicService,               
    TempleteService,
    JwtService,

    /* Repository Provider Setting */
    TopicRepository,
    AuthRepository
  ]
})
export class TopicModule {}
