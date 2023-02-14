import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthRepository } from 'src/auth/auth.repository';
import { TempleteService } from 'src/templete/templete.service';
import { TopicController } from './topic.controller';
import { TopicRepository } from './topic.repository';
import { TopicService } from './topic.service';

/**
 * topic 모듈은 해당 프로젝트의 세부 게시판에 대해 CRUD 를 구현한 모듈입니다.
 * 해당 모듈을 사용하기 위해서는 로그인 과정을 통해 Jwt 토큰을 발급 받아야 사용할 수 있습니다.
 */
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
