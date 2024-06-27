import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { MyLogger } from './my-logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new MyLogger()
  });

  app.use(
    ['/api/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  app.enable('trust proxy');
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  app.enableCors({
    // origin: 'https://camping.gbsw.hs.kr',
    maxAge: 86400,
  });

  app.use(helmet());

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('gbsw 스쿨캠핑 api 문서')
    .setDescription('gbsw - school camping backend api document')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'JWT 토큰을 입력해주세요',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'gbsw 스쿨캠핑 api 문서',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, swaggerOptions);

  await app.listen(3000);
}
bootstrap();
