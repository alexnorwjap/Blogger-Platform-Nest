import { DeviceViewDto } from '../../api/view-dto/device.view-dto';
import { DeviceTypeORM } from '../../domain/device-typeorm.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class DeviceQueryRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll(userId: string): Promise<DeviceViewDto[]> {
    const devices: DeviceTypeORM[] = await this.dataSource.query(
      ` SELECT * FROM devices WHERE "userId" = $1 AND "deletedAt" IS NULL`,
      [userId],
    );

    return devices.map((device) => DeviceViewDto.mapToView(device));
  }
}
