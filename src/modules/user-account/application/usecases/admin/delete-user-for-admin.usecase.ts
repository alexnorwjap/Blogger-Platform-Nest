import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

class DeleteUserForAdminCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserForAdminCommand)
class DeleteUserForAdminUseCase implements ICommandHandler<DeleteUserForAdminCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: DeleteUserForAdminCommand) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }

    user.softDelete();
    await this.userRepository.save(user);
  }
}

export { DeleteUserForAdminCommand, DeleteUserForAdminUseCase };
