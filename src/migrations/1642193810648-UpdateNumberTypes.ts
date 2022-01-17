import { MigrationInterface, QueryRunner } from 'typeorm';

export default class UpdateNumberTypes1642193810648 implements MigrationInterface {
  name = 'UpdateNumberTypes1642193810648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "sendTo"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "receiveFrom"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "sendToAddress" uuid`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "receiveFromAddress" uuid`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "value"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "value" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currentCotation"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "currentCotation" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "coin" ADD "amount" numeric NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_76f4a2140e9ac94e898fa0088f1" FOREIGN KEY ("sendToAddress") REFERENCES "wallet"("address") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_53b736ab7c99ca0c1681e55fde9" FOREIGN KEY ("receiveFromAddress") REFERENCES "wallet"("address") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_53b736ab7c99ca0c1681e55fde9"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_76f4a2140e9ac94e898fa0088f1"`);
    await queryRunner.query(`ALTER TABLE "coin" DROP COLUMN "amount"`);
    await queryRunner.query(`ALTER TABLE "coin" ADD "amount" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "currentCotation"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "currentCotation" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "value"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "value" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "receiveFromAddress"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "sendToAddress"`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "receiveFrom" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "transaction" ADD "sendTo" character varying NOT NULL`);
  }
}
