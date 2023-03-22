import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://develop.bullscourses.com',
      'https://bullscourses.com',
      'http://localhost:4200',
    ],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
