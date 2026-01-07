import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from 'src/core/core.config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private coreConfig: CoreConfig,
  ) {}

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      from: `INCUBATOR <${this.coreConfig.emailUser}>`,
      to: email,
      subject: 'Confirm your email',
      html: ` <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
      </p>
`,
    });
  }

  async sendPasswordRecoveryEmail(
    email: string,
    recoveryCode: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: `INCUBATOR <${this.coreConfig.emailUser}>`,
      to: email,
      subject: 'Password recovery',
      html: `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/confirm-email?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>
`,
    });
  }
}
