import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCollation1771961323914 implements MigrationInterface {
  name = 'ChangeCollation1771961323914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment_likes" DROP COLUMN "testField"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment_likes" ADD "testField" character varying NOT NULL`,
    );
  }
}
