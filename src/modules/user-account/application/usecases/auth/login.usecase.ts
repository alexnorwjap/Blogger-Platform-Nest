import {
  Command,
  CommandBus,
  CommandHandler,
  ICommandHandler,
} from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import type { AccessTokenViewDto } from 'src/modules/user-account/api/view-dto/acsses-token.view-dto';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { Inject } from '@nestjs/common';
import { CreateDeviceCommand } from '../device/create-device.usecase';
import RegistrationContextDto from 'src/modules/user-account/guards/dto/registration-context.dto';

class LoginCommand extends Command<AccessTokenViewDto> {
  constructor(public readonly registrationContextDto: RegistrationContextDto) {
    super();
  }
}

@CommandHandler(LoginCommand)
class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshTokenContext: JwtService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute({ registrationContextDto }: LoginCommand) {
    const newDeviceId = await this.commandBus.execute(
      new CreateDeviceCommand({
        ip: registrationContextDto.ip,
        title: registrationContextDto.title,
        userId: registrationContextDto.userId,
      }),
    );

    const accessToken = this.accessTokenContext.sign({
      id: newDeviceId.userId,
    });
    const refreshToken = this.refreshTokenContext.sign({
      deviceId: newDeviceId.deviceId,
      userId: newDeviceId.userId,
      lastActiveDate: newDeviceId.lastActiveDate,
    });

    // заглушка из промиса, чтобы откапался линтер с await
    await Promise.resolve();
    return {
      accessToken,
      refreshToken,
    };
  }
}

export { LoginCommand, LoginUseCase };
