import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Wallet from '../../entities/wallet.entity';
import Coin from '../../entities/coin.entity';

@Entity('transaction')
export default class Transaction {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Value of the transaction'
  })
  @Column({
    nullable: false,
    type: 'decimal',
    transformer: { from: (value: string) => parseFloat(value), to: (value: number) => value.toString() }
  })
  value: number;

  @ApiProperty({
    description: 'Date of the transaction'
  })
  @Column({
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  datetime: Date;

  @ApiProperty({
    description: 'Wallet to send value',
    type: String
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.address, { onDelete: 'CASCADE' })
  @Transform(({ value }) => value.address)
  sendTo: Wallet;

  @ApiProperty({
    description: 'Wallet to receive value',
    type: String
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.address, { onDelete: 'CASCADE' })
  @Transform(({ value }) => value.address)
  receiveFrom: Wallet;

  @ApiProperty({
    description: 'Current cotation of the coin'
  })
  @Column({
    nullable: false,
    type: 'decimal',
    transformer: { from: (value: string) => parseFloat(value), to: (value: number) => value.toString() }
  })
  currentCotation: number;

  @ManyToOne(() => Coin, (coin) => coin.id, { onDelete: 'CASCADE' })
  coin: Coin;

  constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial);
  }
}
