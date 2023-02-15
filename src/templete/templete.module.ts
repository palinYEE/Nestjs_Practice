import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TempleteService } from './templete.service';

/**
 * templete 모듈은 auth, topic 모듈에서 사용하고 있는 공통 서비스를 제공하는 모듈입니다.
 */
@Module({
  providers: [TempleteService, JwtService]
})
export class TempleteModule {}
