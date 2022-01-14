import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Transaction from '../transaction/entities/transaction.entity';
import Wallet from './wallet.entity';

@Entity('coin')
export default class Coin {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  wallet: Wallet;

  @ApiProperty({
    description: 'Coin that will be used to make the transaction',
    type: Transaction,
    isArray: true
  })
  @JoinTable()
  @OneToMany(() => Transaction, (transaction) => transaction.coin, { onDelete: 'CASCADE', cascade: true })
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
  @Column({ nullable: false, type: 'decimal' })
  amount: number;
}
