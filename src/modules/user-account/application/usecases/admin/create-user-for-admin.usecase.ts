import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';

import { CheckAndCreateCommand } from '../shared/check-create-user.usecase';

export class CreateUserForAdminCommand extends Command<{ userId: string }> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUserForAdminCommand)
export class CreateUserForAdminUseCase implements ICommandHandler<CreateUserForAdminCommand> {
  constructor(private commandBus: CommandBus) {}

  async execute({ dto }: CreateUserForAdminCommand) {
    const idNewUser = await this.commandBus.execute(
      new CheckAndCreateCommand(dto),
    );

    return { userId: idNewUser };
  }
}
