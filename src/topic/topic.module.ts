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
    AuthModule
  ],
  controllers: [TopicController],
  providers: [
    TopicService,
    TopicRepository,
    TempleteService,
    JwtService,
    AuthRepository
  ]
})
export class TopicModule {}
