import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { QueryBus } from '@nestjs/cqrs';
import { GetDeviceByIdNotFoundQuery } from '../../queries/device/get-device.not-found.query';
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
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute({ userContextDto, deviceId }: DeleteDeviceCommand) {
    const device = await this.queryBus.execute(
      new GetDeviceByIdNotFoundQuery(deviceId),
    );
    if (device.userId !== userContextDto.userId) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
      });
    }
    await this.deviceRepository.updateDevice(device.id, {
      deletedAt: new Date(),
    });
  }
}

export { DeleteDeviceCommand, DeleteDeviceUseCase };
