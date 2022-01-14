import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Coin from '../../entities/coin.entity';

@Entity('transaction')
export default class Transaction {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  value: number;

  @Column({
    nullable: false,
    type: 'date',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  datetime: Date;

  @Column({ nullable: false })
  sendTo: string;

  @Column({ nullable: false })
  receiveFrom: string;

  @Column({ nullable: false })
  currentCotation: number;

  @ManyToOne(() => Coin, (coin) => coin.id)
  coin: Coin;
}
