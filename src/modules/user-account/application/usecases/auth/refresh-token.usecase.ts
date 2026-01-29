import RefreshTokenContextDto from 'src/modules/user-account/guards/dto/refresh-token-context.dto';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from 'src/modules/user-account/constants/auth-tokens.inject-constants';
import { GetDeviceByIdQuery } from '../../queries/device/get-device.unauthorized.query';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';

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
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: RefreshTokenCommand) {
    const device = await this.queryBus.execute(
      new GetDeviceByIdQuery(dto.deviceId),
    );
    const newDevice = await this.deviceRepository.updateDevice(device.id, {
      lastActiveDate: new Date(),
    });

    const accessToken = this.accessTokenContext.sign({ id: dto.userId });
    const refreshToken = this.refreshTokenContext.sign({
      deviceId: dto.deviceId,
      userId: dto.userId,
      lastActiveDate: newDevice.lastActiveDate,
    });

    await Promise.resolve();
    return {
      accessToken,
      refreshToken,
    };
  }
}

export { RefreshTokenCommand, RefreshTokenUseCase };
