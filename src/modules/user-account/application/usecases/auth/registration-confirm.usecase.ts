import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { RegistrationConfirmationDto } from 'src/modules/user-account/dto/registration-confirmation.dto';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

class RegistrationConfirmationCommand {
  constructor(public readonly dto: RegistrationConfirmationDto) {}
}

@CommandHandler(RegistrationConfirmationCommand)
class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: RegistrationConfirmationCommand) {
    const user = await this.userRepository.findByConfirmationCode(dto.code);
    if (
      !user ||
      user.isEmailConfirmed ||
      user.confirmationExpirationDate.getTime() < Date.now()
    ) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Code not valid or expired', 'code')],
      });
    }
    await this.userRepository.updateUser(user.id, {
      isEmailConfirmed: true,
    });
  }
}

export { RegistrationConfirmationCommand, RegistrationConfirmationUseCase };
