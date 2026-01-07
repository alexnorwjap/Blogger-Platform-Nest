import { InjectModel } from '@nestjs/mongoose';
import { DeviceDocument } from '../domain/device.entity';
import { Device } from '../domain/device.entity';
import { Model } from 'mongoose';

class DeviceRepository {
  constructor(
    @InjectModel(Device.name)
    private deviceModel: Model<DeviceDocument>,
  ) {}

  async getDeviceById(deviceId: string): Promise<DeviceDocument | null> {
    return await this.deviceModel.findById(deviceId);
  }

  async save(device: DeviceDocument) {
    return await device.save();
  }

  async markOtherDevicesAsDeleted(userId: string, deviceId: string) {
    return await this.deviceModel.updateMany(
      { userId, deletedAt: null, _id: { $ne: deviceId } },
      { deletedAt: new Date() },
    );
  }
}

export { DeviceRepository };
