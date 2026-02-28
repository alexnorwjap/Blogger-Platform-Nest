import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';

import { Device } from 'src/modules/user-account/domain/device.entity';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserRepository } from 'src/modules/user-account/infrastructure/user.repository';

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
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: CreateDeviceCommand) {
    const user = await this.userRepository.getUserById(dto.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    const device = Device.createInstance(dto);
    await this.deviceRepository.save(device);
    return {
      deviceId: device.id,
      userId: device.userId,
      lastActiveDate: device.lastActiveDate,
    };
  }
}

export { CreateDeviceCommand, CreateDeviceUseCase };
