import { Module } from '@nestjs/common';
import { TempleteService } from './templete.service';

@Module({
  providers: [TempleteService]
})
export class TempleteModule {}
