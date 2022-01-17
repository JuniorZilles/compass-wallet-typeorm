import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { toDate, toStringDate } from '../utils/date-transform';
import Coin from './coin.entity';

@Entity('wallet')
export default class Wallet {
  @ApiProperty({
    description: 'Person identifier Address'
  })
  @PrimaryGeneratedColumn('uuid')
  address: string;

  @ApiProperty({
    description: 'Person Name'
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    description: 'CPF of the person',
    format: 'XXX.XXX.XXX-XX'
  })
  @Column({ nullable: false, unique: true })
  cpf: string;

  @ApiProperty({
    description: 'BirthDate of the person',
    format: 'DD/MM/YYYY',
    type: String
  })
  @Column({
    nullable: false,
    type: 'date',
    transformer: { to: (value: string) => toDate(value), from: (value: Date) => value }
  })
  @Transform(({ value }) => toStringDate(value))
  birthdate: Date | string;

  @ApiProperty({
    description: 'List of the coins of a wallet',
    isArray: true,
    type: () => Coin
  })
  @OneToMany(() => Coin, (coin) => coin.wallet, { cascade: true })
  coins: Coin[];

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updated_at: Date;

  constructor(partial: Partial<Wallet>) {
    Object.assign(this, partial);
  }
}
