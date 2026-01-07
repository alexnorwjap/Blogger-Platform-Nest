import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DeviceDocument } from 'src/modules/user-account/domain/device.entity';
import { DeviceRepository } from 'src/modules/user-account/infrastructure/device.repository';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/filters/domain-exceptions-code';

class GetDeviceByIdNotFoundQuery extends Query<DeviceDocument> {
  constructor(public readonly deviceId: string) {
    super();
  }
}

@QueryHandler(GetDeviceByIdNotFoundQuery)
class GetDeviceByIdNotFoundQueryHandler implements IQueryHandler<GetDeviceByIdNotFoundQuery> {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async execute({ deviceId }: GetDeviceByIdNotFoundQuery) {
    const device = await this.deviceRepository.getDeviceById(deviceId);
    if (!device) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
      });
    }
    return device;
  }
}

export { GetDeviceByIdNotFoundQuery, GetDeviceByIdNotFoundQueryHandler };
