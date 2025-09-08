import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app';
import { DefaultLogger } from '@Logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(DefaultLogger));

  await app.listen(3000);
}

bootstrap();
