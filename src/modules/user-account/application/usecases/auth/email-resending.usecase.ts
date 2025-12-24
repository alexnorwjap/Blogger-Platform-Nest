import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { EmailService } from 'src/modules/notifications/email.service';
import { EmailDto } from 'src/modules/user-account/dto/email.dto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

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
    user.resetConfirmationCode();
    await this.userRepository.save(user);

    this.emailService
      .sendConfirmationEmail(user.email, user.confirmation.confirmationCode)
      .catch(console.error);
  }
}

export { EmailResendingCommand, EmailResendingUseCase };
