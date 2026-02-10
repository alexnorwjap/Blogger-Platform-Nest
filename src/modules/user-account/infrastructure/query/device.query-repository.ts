import { DeviceViewDto } from '../../api/view-dto/device.view-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../domain/device.entity';

export class DeviceQueryRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async findAll(userId: string): Promise<DeviceViewDto[]> {
    const devices = await this.deviceRepo.find({
      where: {
        userId,
        deletedAt: IsNull(),
      },
    });
    return devices.map((device) => DeviceViewDto.mapToView(device));
  }
}
