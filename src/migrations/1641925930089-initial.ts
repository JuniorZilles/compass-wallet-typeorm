import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Initial1641925930089 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.createTable(
      new Table({
        name: 'wallet',
        columns: [
          {
            name: 'address',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            generationStrategy: 'uuid'
          },
          {
            name: 'cpf',
            type: 'varchar',
            isUnique: true,
            length: '14',
            isNullable: false
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: false
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallet');
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
}
