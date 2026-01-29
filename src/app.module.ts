import { Module } from '@nestjs/common';
import { configModule } from './config-dynamic-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BloggersAppModule } from './modules/bloggers-app/bloggers-app.module';
import { UserAccountsModule } from './modules/user-account/user-accounts.module';
import { TestingModule } from './modules/testing/testing.module';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/config/core.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './core/config/typeorm.config';

@Module({
  imports: [
    configModule,
    BloggersAppModule,
    UserAccountsModule,
    TypeOrmModule.forRootAsync({
      useFactory: getTypeOrmConfig,
      inject: [CoreConfig],
    }),
    NotificationsModule,
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 5 }]),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],
})
export class AppModule {
  static forRoot(coreConfig: CoreConfig) {
    return {
      module: AppModule,
      imports: [...(coreConfig.isTestingEnabled ? [TestingModule] : [])],
    };
  }
}
