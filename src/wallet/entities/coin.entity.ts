import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Transaction from '../transaction/entities/transaction.entity';
import Wallet from './wallet.entity';

@Entity('coin')
export default class Coin {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @ManyToOne(() => Wallet, (wallet) => wallet.address, { onDelete: 'CASCADE' })
  wallet: Wallet;

  @ApiProperty({
    description: 'Coin that will be used to make the transaction',
    type: Transaction,
    isArray: true
  })
  @OneToMany(() => Transaction, (transaction) => transaction.coin, { cascade: true })
  transactions: Transaction[];

  @ApiProperty({
    description: 'Selected coin'
  })
  @Column({ nullable: false })
  coin: string;

  @ApiProperty({
    description: 'Coin fullname'
  })
  @Column({ nullable: false })
  fullname: string;

  @ApiProperty({
    description: 'Coin amount'
  })
  @Column({
    nullable: false,
    type: 'decimal',
    transformer: { from: (value: string) => parseFloat(value), to: (value: number) => value.toString() }
  })
  amount: number;

  constructor(partial: Partial<Coin>) {
    Object.assign(this, partial);
  }
}
