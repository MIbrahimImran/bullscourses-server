import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://developbullscourses.netlify.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
