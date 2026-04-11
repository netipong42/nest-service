import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const errors: Record<string, string[]> = {};
        validationErrors.forEach((error) => {
          const constraints = Object.values(error.constraints || {});
          errors[error.property] = constraints;
        });
        return new UnprocessableEntityException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3000;

  await app.listen(port);
}
bootstrap();
