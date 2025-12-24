import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import UserContextDto from 'src/modules/user-account/guards/dto/user.context.dto';
import type { AccessTokenViewDto } from 'src/modules/user-account/api/view-dto/acsses-token.view-dto';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { Inject } from '@nestjs/common';

class LoginCommand extends Command<AccessTokenViewDto> {
  constructor(public readonly userContext: UserContextDto) {
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
  ) {}

  async execute({ userContext }: LoginCommand) {
    const accessToken = this.accessTokenContext.sign(userContext);
    const refreshToken = this.refreshTokenContext.sign(userContext);

    // заглушка из промиса, чтобы откапался линтер с await
    await Promise.resolve();
    return {
      accessToken,
      refreshToken,
    };
  }
}

export { LoginCommand, LoginUseCase };
