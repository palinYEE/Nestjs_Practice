import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { IndexModule } from './index/index.module';
import { TempleteModule } from './templete/templete.module';
import { TopicModule } from './topic/topic.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),                   /* typeORM 을 사용하기 위한 셋팅을 import */
    IndexModule, TempleteModule, TopicModule, AuthModule],  /* 사용할 모듈 import */
  controllers: [],
  providers: [],
})
export class AppModule {}
