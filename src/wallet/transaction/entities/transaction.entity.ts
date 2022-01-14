import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import Wallet from 'src/wallet/entities/wallet.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Coin from '../../entities/coin.entity';

@Entity('transaction')
export default class Transaction {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Value of the transaction'
  })
  @Column({ nullable: false })
  value: number;

  @ApiProperty({
    description: 'Date of the transaction'
  })
  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  datetime: Date;

  @ApiProperty({
    description: 'Wallet to send value',
    type: String
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  sendTo: Wallet;

  @ApiProperty({
    description: 'Wallet to receive value',
    type: String
  })
  @ManyToOne(() => Wallet, (wallet) => wallet.address)
  receiveFrom: Wallet;

  @ApiProperty({
    description: 'Current cotation of the coin'
  })
  @Column({ nullable: false })
  currentCotation: number;

  @ManyToOne(() => Coin, (coin) => coin.id)
  coin: Coin;
}
