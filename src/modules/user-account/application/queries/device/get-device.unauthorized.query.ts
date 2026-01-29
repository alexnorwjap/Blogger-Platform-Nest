import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';
import { DeviceTypeORM } from 'src/modules/user-account/domain/device-typeorm.entity';

class GetDeviceByIdQuery extends Query<DeviceTypeORM> {
  constructor(public readonly deviceId: string) {
    super();
  }
}

@QueryHandler(GetDeviceByIdQuery)
class GetDeviceByIdQueryHandler implements IQueryHandler<GetDeviceByIdQuery> {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute({ deviceId }: GetDeviceByIdQuery) {
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
      });
    }
    return device;
  }
}

export { GetDeviceByIdQuery, GetDeviceByIdQueryHandler };
