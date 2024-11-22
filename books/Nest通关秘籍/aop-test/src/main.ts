import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Response, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    next();
    console.log('after');
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
