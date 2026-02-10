import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import RefreshTokenContextDto from 'src/modules/user-account/guards/dto/refresh-token-context.dto';

class DeleteDeviceCommand {
  constructor(
    public readonly userContextDto: RefreshTokenContextDto,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
class DeleteDeviceUseCase implements ICommandHandler<DeleteDeviceCommand> {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute({ userContextDto, deviceId }: DeleteDeviceCommand) {
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    if (device.userId !== userContextDto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    device.softDelete();
    await this.deviceRepository.save(device);
  }
}

export { DeleteDeviceCommand, DeleteDeviceUseCase };
