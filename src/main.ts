import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  /* config setting  */
  const server = config.get('server');              
  const sessionSetting = config.get('session');

  const app = await NestFactory.create(AppModule);

  /* middleware setting */
  app.use(cookieParser());      /* 쿠키 데이터를 객체로 받을 수 있게 파싱해주는 미들웨어 */
  app.use(                      /* 세션을 사용할 수 있게 셋팅 하는 미들웨어 */
    session({
      secret: sessionSetting.secret,                      /* 세션 ID 를 만드는데 사용되는 secret key */
      resave: sessionSetting.resave,                      /* 세션이 수정되지 않아도 지속적으로 저장하게 하는 옵션 */
      saveUninitialized: sessionSetting.saveUninitialized /* 초기화되지 않는 세션을 저장하게 하는 옵션 */
    }),
  );

  /* RUN */
  await app.listen(server.port);
}
bootstrap();
