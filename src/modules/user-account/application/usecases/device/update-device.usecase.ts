import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { QueryBus } from '@nestjs/cqrs';
import { GetDeviceByIdQuery } from '../../queries/device/get-device.unauthorized.query';

class UpdateDeviceCommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(UpdateDeviceCommand)
class UpdateDeviceUseCase implements ICommandHandler<UpdateDeviceCommand> {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ deviceId }: UpdateDeviceCommand) {
    const device = await this.queryBus.execute(
      new GetDeviceByIdQuery(deviceId),
    );
    device.updateDate();
    await this.deviceRepository.save(device);
  }
}

export { UpdateDeviceCommand, UpdateDeviceUseCase };
