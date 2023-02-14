import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TempleteService } from 'src/templete/templete.service';
import { TopicRepository } from 'src/topic/topic.repository';
import { IndexController } from './index.controller';
import { IndexService } from './index.service';

@Module({
  controllers: [IndexController],
  providers: [
    IndexService,
    TempleteService,
    TopicRepository,
    JwtService
  ]
})
export class IndexModule {}
