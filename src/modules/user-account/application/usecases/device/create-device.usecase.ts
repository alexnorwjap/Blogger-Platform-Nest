import {
  Command,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import type { DeviceModelType } from 'src/modules/user-account/domain/device.entity';
import { GetUserByIdQuery } from '../../queries/user/getUserById.query';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from 'src/modules/user-account/domain/device.entity';

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
    @InjectModel(Device.name)
    private readonly deviceModel: DeviceModelType,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ dto }: CreateDeviceCommand) {
    await this.queryBus.execute(new GetUserByIdQuery(dto.userId));
    const device = this.deviceModel.createInstance(dto);
    await this.deviceRepository.save(device);
    return {
      deviceId: device._id.toString(),
      userId: device.userId,
      lastActiveDate: device.lastActiveDate,
    };
  }
}

export { CreateDeviceCommand, CreateDeviceUseCase };
