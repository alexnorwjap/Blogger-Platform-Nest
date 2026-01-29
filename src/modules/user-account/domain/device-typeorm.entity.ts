class DeviceTypeORM {
  id: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  userId: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

class ToDeviceEntity {
  static mapToEntity(device: DeviceTypeORM): DeviceTypeORM {
    return {
      id: device.id,
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate,
      userId: device.userId,
      deletedAt: device.deletedAt,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
    };
  }
}

export { DeviceTypeORM, ToDeviceEntity };
