import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailDto } from 'src/modules/user-account/dto/email.dto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { EmailService } from 'src/modules/notifications/email.service';

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
    const user = await this.userRepository.getUserByEmail(dto.email);
    if (!user) return;

    user.updateRecoveryCode();
    await this.userRepository.save(user);

    this.emailService
      .sendPasswordRecoveryEmail(user.email, user.recoveryCode!)
      .catch(console.error);
  }
}

export { PasswordRecoveryCodeCommand, PasswordRecoveryCodeUseCase };
