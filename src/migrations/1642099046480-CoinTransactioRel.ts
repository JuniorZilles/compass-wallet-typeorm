import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CoinTransactioRel1642099046480 implements MigrationInterface {
  name = 'CoinTransactioRel1642099046480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "datetime" date NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "sendTo" character varying NOT NULL, "receiveFrom" character varying NOT NULL, "currentCotation" integer NOT NULL, "coinId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("address" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "birthdate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_a837f14f38d74c05f8f18aba4f5" UNIQUE ("cpf"), CONSTRAINT "PK_1dcc9f5fd49e3dc52c6d2393c53" PRIMARY KEY ("address"))`
    );
    await queryRunner.query(
      `CREATE TABLE "coin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coin" character varying NOT NULL, "fullname" character varying NOT NULL, "amount" integer NOT NULL, "walletAddress" uuid, CONSTRAINT "PK_650993fc71b789e4793b62fbcac" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_830c5089eb6ff83f5bcc3ec3d3c" FOREIGN KEY ("coinId") REFERENCES "coin"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "coin" ADD CONSTRAINT "FK_6a2e9761a5e0e2cdcb68fa30e9e" FOREIGN KEY ("walletAddress") REFERENCES "wallet"("address") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coin" DROP CONSTRAINT "FK_6a2e9761a5e0e2cdcb68fa30e9e"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_830c5089eb6ff83f5bcc3ec3d3c"`);
    await queryRunner.query(`DROP TABLE "coin"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
