import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../dto/create-user.dto';
import { UserRepository } from '../../../infrastructure/user.repository';
import { DomainException, Extension } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { CryptoService } from '../../crypto.service';

export class CheckAndCreateCommand extends Command<string> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CheckAndCreateCommand)
export class CheckAndCreateUseCase implements ICommandHandler<CheckAndCreateCommand> {
  constructor(
    private userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute({ dto }: CheckAndCreateCommand) {
    // TODO: Вынести в отдельный bus?
    const user = await this.userRepository.getUserByLoginOrEmail(dto.login, dto.email);

    if (user) {
      const coincidence = user.login === dto.login ? 'login' : 'email';
      const extension = new Extension(`This ${coincidence} not valid`, coincidence);
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'errorsMessages',
        extensions: [extension],
      });
    }

    const hashPassword = await this.cryptoService.hashPassword(dto.password);
    const idNewUser = await this.userRepository.createUser({
      login: dto.login,
      email: dto.email,
      password: hashPassword,
    });

    // await this.userRepository.save(newUser);

    return idNewUser;
  }
}
