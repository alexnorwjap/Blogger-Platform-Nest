import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Device } from '../domain/device.entity';

@Injectable()
class DeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async getDeviceById(deviceId: string): Promise<Device | null> {
    return await this.deviceRepo.findOne({ where: { id: deviceId, deletedAt: IsNull() } });
  }

  async save(device: Device): Promise<Device> {
    return this.deviceRepo.save(device);
  }

  async markOtherDevicesAsDeleted(userId: string, deviceId: string) {
    await this.deviceRepo.update(
      {
        userId,
        id: Not(deviceId),
      },
      {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    );
  }
}

export { DeviceRepository };
