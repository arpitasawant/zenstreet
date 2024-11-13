import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './utils/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}

bootstrap();
