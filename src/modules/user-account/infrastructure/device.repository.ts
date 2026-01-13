import { CreateDeviceDto } from '../dto/create-device.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceTypeORM, ToDeviceEntity } from '../domain/device-typeorm.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class DeviceRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getDeviceById(deviceId: string): Promise<DeviceTypeORM | null> {
    const result: DeviceTypeORM[] = await this.dataSource.query(
      ` SELECT * FROM devices WHERE id = $1 AND "deletedAt" IS NULL`,
      [deviceId],
    );
    if (result.length === 0) return null;
    return ToDeviceEntity.mapToEntity(result[0]);
  }

  async createDevice(dto: CreateDeviceDto) {
    const result: DeviceTypeORM[] = await this.dataSource.query(
      ` INSERT INTO devices (ip, title, "userId")
         VALUES ($1, $2, $3)
         RETURNING *
      `,
      [dto.ip, dto.title, dto.userId],
    );
    return ToDeviceEntity.mapToEntity(result[0]);
  }

  async updateDevice(deviceId: string, updates: Record<string, any>) {
    const conditions = Object.keys(updates)
      .map((field, index) => `"${field}" = $${index + 1}`)
      .join(', ');
    const params = Object.values(updates);

    const query = `
    UPDATE devices 
    SET ${conditions}, "updatedAt" = CURRENT_TIMESTAMP
    WHERE id = $${params.length + 1}
    RETURNING *
  `;

    const result: DeviceTypeORM[] = await this.dataSource.query(query, [
      ...params,
      deviceId,
    ]);
    return ToDeviceEntity.mapToEntity(result[0]);
  }

  async markOtherDevicesAsDeleted(userId: string, deviceId: string) {
    await this.dataSource.query(
      ` UPDATE devices 
         SET "deletedAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
         WHERE "userId" = $1 AND id != $2
      `,
      [userId, deviceId],
    );
  }
}

export { DeviceRepository };
