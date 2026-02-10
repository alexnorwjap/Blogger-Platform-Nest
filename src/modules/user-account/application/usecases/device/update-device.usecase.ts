import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class UpdateDeviceCommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(UpdateDeviceCommand)
class UpdateDeviceUseCase implements ICommandHandler<UpdateDeviceCommand> {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute({ deviceId }: UpdateDeviceCommand) {
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    device.updateLastActive();
    await this.deviceRepository.save(device);
  }
}

export { UpdateDeviceCommand, UpdateDeviceUseCase };
