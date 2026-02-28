import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column({ type: 'timestamptz' })
  lastActiveDate: Date;

  @Column('uuid')
  userId: string;

  @Column({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  static createInstance(dto: CreateDeviceDto): Device {
    const device = new Device();
    device.ip = dto.ip;
    device.title = dto.title;
    device.userId = dto.userId;
    device.lastActiveDate = new Date();
    return device;
  }

  updateLastActiveDate(): void {
    this.lastActiveDate = new Date();
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  updateLastActive(): void {
    this.lastActiveDate = new Date();
  }
}
