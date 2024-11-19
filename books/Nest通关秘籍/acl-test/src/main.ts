import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
