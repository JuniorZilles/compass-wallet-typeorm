import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class Initial1641925930089 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wallet',
        columns: [
          {
            name: 'address',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
            generationStrategy: 'uuid'
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '14',
            isNullable: false
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallet');
    await queryRunner.dropDatabase(process.env.TYPEORM_DATABASE);
  }
}
