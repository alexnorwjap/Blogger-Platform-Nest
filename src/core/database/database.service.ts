import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { DeviceSchema } from './schemas/device.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    // если переписываем схему, то нужно удалить таблицы
    await this.dataSource.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await this.dataSource.query(`DROP TABLE IF EXISTS devices CASCADE;`);

    const schemas = [UserSchema, DeviceSchema];
    for (const sql of schemas) {
      await this.dataSource.query(sql);
    }
  }
}
