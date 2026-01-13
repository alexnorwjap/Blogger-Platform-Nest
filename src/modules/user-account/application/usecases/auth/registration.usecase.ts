import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';

import { EmailService } from 'src/modules/notifications/email.service';
import { CheckAndCreateCommand } from '../shared/check-create-user.usecase';
import { UserTypeORM } from 'src/modules/user-account/domain/user-typeorm.entity';
import { GetUserByIdQuery } from '../../queries/user/getUserById.query';

class RegistrationCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegistrationCommand)
class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
  constructor(
    private commandBus: CommandBus,
    private readonly emailService: EmailService,
    private queryBus: QueryBus,
  ) {}

  async execute({ dto }: RegistrationCommand) {
    const userId = await this.commandBus.execute(
      new CheckAndCreateCommand(dto),
    );
    const newUser: UserTypeORM = await this.queryBus.execute(
      new GetUserByIdQuery(userId),
    );

    this.emailService
      .sendConfirmationEmail(newUser.email, newUser.confirmationCode)
      .catch(console.error);
  }
}

export { RegistrationCommand, RegistrationUseCase };
