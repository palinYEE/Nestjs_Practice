import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { IndexModule } from './index/index.module';
import { TempleteModule } from './templete/templete.module';
import { TopicModule } from './topic/topic.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    IndexModule, TempleteModule, TopicModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
