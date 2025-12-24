import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  DomainException,
  Extension,
} from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';
import { NewPasswordDto } from 'src/modules/user-account/dto/new-password.dto';
import { CryptoService } from '../../crypto.service';

class PasswordRecoveryCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}

@CommandHandler(PasswordRecoveryCommand)
class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute({ dto }: PasswordRecoveryCommand) {
    const user = await this.userRepository.findByRecoveryCode(dto.recoveryCode);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [new Extension('Invalid recovery code', 'recoveryCode')],
      });
    }
    if (user.recoveryCodeExpirationDate.getTime() < Date.now()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
      });
    }

    const hashedPassword = await this.cryptoService.hashPassword(
      dto.newPassword,
    );
    user.updatePassword(hashedPassword);

    await this.userRepository.save(user);
  }
}

export { PasswordRecoveryCommand, PasswordRecoveryUseCase };
