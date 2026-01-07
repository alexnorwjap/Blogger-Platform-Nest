import type { DeviceModelType } from '../../domain/device.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from '../../domain/device.entity';
import { DeviceViewDto } from '../../api/view-dto/device.view-dto';

export class DeviceQueryRepository {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: DeviceModelType,
  ) {}

  async findAll(userId: string): Promise<DeviceViewDto[]> {
    const devices = await this.deviceModel.find({ userId, deletedAt: null });
    return devices.map((device) => DeviceViewDto.mapToView(device));
  }
}
