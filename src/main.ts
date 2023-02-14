import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const server = config.get('server');
  const sessionSetting = config.get('session');
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      secret: sessionSetting.secret,
      resave: sessionSetting.resave,
      saveUninitialized: sessionSetting.saveUninitialized
    }),
  );
  await app.listen(server.port);
}
bootstrap();
