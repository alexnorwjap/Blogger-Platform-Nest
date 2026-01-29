import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { GetUserByIdQuery } from 'src/modules/user-account/application/queries/user/getUserById.query';
import { QueryBus } from '@nestjs/cqrs';

class DeleteUserForAdminCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserForAdminCommand)
class DeleteUserForAdminUseCase implements ICommandHandler<DeleteUserForAdminCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private queryBus: QueryBus,
  ) {}

  async execute({ id }: DeleteUserForAdminCommand) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(id));
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    await this.userRepository.updateUser(user.id, {
      deletedAt: new Date(),
    });
  }
}

export { DeleteUserForAdminCommand, DeleteUserForAdminUseCase };
