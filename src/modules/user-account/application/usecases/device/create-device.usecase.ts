import {
  Command,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';

import { GetUserByIdQuery } from '../../queries/user/getUserById.query';

class CreateDeviceDto {
  ip: string;
  title: string;
  userId: string;
}

class CreateDeviceCommand extends Command<{
  deviceId: string;
  userId: string;
  lastActiveDate: Date;
}> {
  constructor(public readonly dto: CreateDeviceDto) {
    super();
  }
}

@CommandHandler(CreateDeviceCommand)
class CreateDeviceUseCase implements ICommandHandler<CreateDeviceCommand> {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: CreateDeviceCommand) {
    await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
    const device = await this.deviceRepository.createDevice(dto);
    return {
      deviceId: device.id,
      userId: device.userId,
      lastActiveDate: device.lastActiveDate,
    };
  }
}

export { CreateDeviceCommand, CreateDeviceUseCase };
