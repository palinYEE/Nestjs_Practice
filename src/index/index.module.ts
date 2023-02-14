import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { IndexController } from './index.controller';
import { IndexService } from './index.service';

/**
 * 메인 화면에 대한 모듈입니다.
 */
@Module({
  controllers: [IndexController],
  providers: [
    /* Service Provider Setting */
    IndexService,
    TempleteService,
    JwtService,
    /* Repository Provider Setting */
    TopicRepository,
  ]
})
export class IndexModule {}
