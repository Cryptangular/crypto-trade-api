import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0';

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(port, host);
}

void bootstrap();
