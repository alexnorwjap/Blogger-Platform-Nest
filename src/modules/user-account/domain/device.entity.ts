import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

class CreateDeviceDto {
  ip: string;
  title: string;
  userId: string;
}

@Schema({ timestamps: true })
class Device {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  ip: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: Date, required: true })
  lastActiveDate: Date;
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  static createInstance(dto: CreateDeviceDto): DeviceDocument {
    const device = new this();
    device.ip = dto.ip;
    device.title = dto.title;
    device.lastActiveDate = new Date();
    device.userId = dto.userId;
    return device as DeviceDocument;
  }

  updateDate(): void {
    this.lastActiveDate = new Date();
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }
}

const DeviceSchema = SchemaFactory.createForClass(Device);
DeviceSchema.loadClass(Device);

type DeviceDocument = HydratedDocument<Device>;
type DeviceModelType = Model<DeviceDocument> & typeof Device;

export { Device, DeviceSchema };
export type { DeviceDocument, DeviceModelType };
