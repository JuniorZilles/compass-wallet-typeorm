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

  @JoinTable()
  @OneToMany(() => Transaction, (transaction) => transaction.coin, { onDelete: 'CASCADE', cascade: true })
  transactions: Transaction[];

  @Column({ nullable: false })
  coin: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: false })
  amount: number;
}
