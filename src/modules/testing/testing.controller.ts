import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    // PostgreSQL очистка через raw SQL
    await this.dataSource.query(`TRUNCATE TABLE comment_likes CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE comments CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE post_likes CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE posts CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE blogs CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE devices CASCADE`);
    await this.dataSource.query(`TRUNCATE TABLE users CASCADE`);
  }
}
