import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailDto } from 'src/modules/user-account/dto/email.dto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { EmailService } from 'src/modules/notifications/email.service';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';

class PasswordRecoveryCodeCommand {
  constructor(public readonly dto: EmailDto) {}
}

@CommandHandler(PasswordRecoveryCodeCommand)
class PasswordRecoveryCodeUseCase implements ICommandHandler<PasswordRecoveryCodeCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute({ dto }: PasswordRecoveryCodeCommand) {
    const user = await this.userRepository.getuserByEmail(dto.email);
    if (!user) return;

    const recoveryCode = randomUUID();
    await this.userRepository.updateUser(user.id, {
      recoveryCode: recoveryCode,
      recoveryCodeExpirationDate: add(new Date(), { minutes: 15 }),
    });

    this.emailService
      .sendPasswordRecoveryEmail(user.email, recoveryCode)
      .catch(console.error);
  }
}

export { PasswordRecoveryCodeCommand, PasswordRecoveryCodeUseCase };
