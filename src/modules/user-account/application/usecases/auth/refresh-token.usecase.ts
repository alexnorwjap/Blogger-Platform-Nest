import RefreshTokenContextDto from 'src/modules/user-account/guards/dto/refresh-token-context.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';

class RefreshTokenCommand {
  constructor(public readonly dto: RefreshTokenContextDto) {}
}

@CommandHandler(RefreshTokenCommand)
class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private readonly refreshTokenContext: JwtService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async execute({ dto }: RefreshTokenCommand) {
    const device = await this.deviceRepository.getDeviceById(dto.deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    device.updateLastActive();
    await this.deviceRepository.save(device);

    const accessToken = this.accessTokenContext.sign({ id: dto.userId });
    const refreshToken = this.refreshTokenContext.sign({
      deviceId: dto.deviceId,
      userId: dto.userId,
      lastActiveDate: device.lastActiveDate,
    });

    await Promise.resolve();
    return {
      accessToken,
      refreshToken,
    };
  }
}

export { RefreshTokenCommand, RefreshTokenUseCase };
