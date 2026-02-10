import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';
import { CoreConfig } from './core/config/core.config';

export const production = true;

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const coreConfig = appContext.get<CoreConfig>(CoreConfig);
  await appContext.close();
  const app = await NestFactory.create(AppModule.forRoot(coreConfig));

  appSetup(app, coreConfig.isSwaggerEnabled);
  await app.listen(coreConfig.port);
}
void bootstrap();
