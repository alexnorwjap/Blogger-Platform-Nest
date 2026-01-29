import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { EmailService } from 'src/modules/notifications/email.service';
import { EmailDto } from 'src/modules/user-account/dto/email.dto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { add } from 'date-fns';

class EmailResendingCommand {
  constructor(public readonly dto: EmailDto) {}
}

@CommandHandler(EmailResendingCommand)
class EmailResendingUseCase implements ICommandHandler<EmailResendingCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute({ dto }: EmailResendingCommand) {
    const user = await this.userRepository.getuserByEmail(dto.email);
    if (!user || user.isEmailConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Email confirmd or not found', 'email')],
      });
    }

    const confirmationCode = randomUUID();

    await this.userRepository.updateUser(user.id, {
      confirmationCode: confirmationCode,
      confirmationExpirationDate: add(new Date(), { minutes: 15 }),
    });

    this.emailService
      .sendConfirmationEmail(user.email, confirmationCode)
      .catch(console.error);
  }
}

export { EmailResendingCommand, EmailResendingUseCase };
