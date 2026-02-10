import { Device } from '../../domain/device.entity';

export class DeviceViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  static mapToView(device: Device): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.ip = device.ip;
    dto.title = device.title;
    dto.lastActiveDate = device.lastActiveDate;
    dto.deviceId = device.id;

    return dto;
  }
}
