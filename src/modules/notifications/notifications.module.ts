import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { CoreConfig } from 'src/core/core.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: coreConfig.emailUser,
            pass: coreConfig.emailPassword,
          },
        },
      }),
      inject: [CoreConfig],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
