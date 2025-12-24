import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserDocument } from '../../../domain/user.entity';
import { CreateUserDto } from '../../../dto/create-user.dto';

import { EmailService } from 'src/modules/notifications/email.service';
import { CheckAndCreateCommand } from '../shared/check-create-user.usecase';

class RegistrationCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private commandBus: CommandBus,
    private readonly emailService: EmailService,
  ) {}

  async execute({ dto }: RegistrationCommand) {
    const newUser: UserDocument = await this.commandBus.execute(
      new CheckAndCreateCommand(dto),
    );

    this.emailService
      .sendConfirmationEmail(
        newUser.email,
        newUser.confirmation.confirmationCode,
      )
      .catch(console.error);
  }
}

export { RegistrationCommand, RegistrationUseCase };
