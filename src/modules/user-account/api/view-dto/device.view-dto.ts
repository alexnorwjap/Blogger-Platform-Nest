import { DeviceTypeORM } from '../../domain/device-typeorm.entity';

export class DeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  static mapToView(device: DeviceTypeORM): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.ip = device.ip;
    dto.title = device.title;
    dto.lastActiveDate = device.lastActiveDate;
    dto.deviceId = device.id;

    return dto;
  }
}
