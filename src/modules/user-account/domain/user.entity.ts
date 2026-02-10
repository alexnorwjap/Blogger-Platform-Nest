import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Device } from './device.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, collation: 'C' })
  login: string;

  @Column({ unique: true, collation: 'C' })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column()
  confirmationCode: string;

  @Column({ type: 'timestamptz' })
  confirmationExpirationDate: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  recoveryCode: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  recoveryCodeExpirationDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  deletedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  static createInstance(dto: CreateUserDto): User {
    const user = new User();
    user.login = dto.login;
    user.email = dto.email;
    user.password = dto.password;
    user.confirmationCode = randomUUID();
    user.confirmationExpirationDate = add(new Date(), { minutes: 15 });
    return user;
  }

  updateConfirmationCode() {
    this.confirmationCode = randomUUID();
    this.confirmationExpirationDate = add(new Date(), { minutes: 15 });
  }

  updateRecoveryCode() {
    this.recoveryCode = randomUUID();
    this.recoveryCodeExpirationDate = add(new Date(), { minutes: 15 });
  }

  updatePassword(password: string) {
    this.password = password;
    this.recoveryCode = null;
    this.recoveryCodeExpirationDate = null;
  }

  softDelete() {
    this.deletedAt = new Date();
  }
}
