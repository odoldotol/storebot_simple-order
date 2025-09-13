import { NestFactory } from '@nestjs/core';
import { AppModule } from '@modules';
import { DefaultLogger } from '@logger/default';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(DefaultLogger));

  await app.listen(3000);
}

bootstrap();
