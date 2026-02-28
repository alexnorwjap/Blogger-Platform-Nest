import { ICommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class RefreshTokenDto {
  userId: string;
  deviceId: string;
}

class DeleteOtherDevicesCommand {
  constructor(public readonly dto: RefreshTokenDto) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
class DeleteOtherDevicesUseCase implements ICommandHandler<DeleteOtherDevicesCommand> {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute({ dto }: DeleteOtherDevicesCommand) {
    const device = await this.deviceRepository.getDeviceById(dto.deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    await this.deviceRepository.markOtherDevicesAsDeleted(dto.userId, dto.deviceId);
  }
}

export { DeleteOtherDevicesCommand, DeleteOtherDevicesUseCase };
