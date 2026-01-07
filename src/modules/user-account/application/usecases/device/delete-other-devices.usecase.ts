import { ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { GetDeviceByIdQuery } from '../../queries/device/get-device.unauthorized.query';
import { CommandHandler } from '@nestjs/cqrs';

class RefreshTokenDto {
  userId: string;
  deviceId: string;
}

class DeleteOtherDevicesCommand {
  constructor(public readonly dto: RefreshTokenDto) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
class DeleteOtherDevicesUseCase implements ICommandHandler<DeleteOtherDevicesCommand> {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: DeleteOtherDevicesCommand) {
    await this.queryBus.execute(new GetDeviceByIdQuery(dto.deviceId));
    await this.deviceRepository.markOtherDevicesAsDeleted(
      dto.userId,
      dto.deviceId,
    );
  }
}

export { DeleteOtherDevicesCommand, DeleteOtherDevicesUseCase };
