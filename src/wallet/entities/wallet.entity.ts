import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { toDate, toStringDate } from '../utils/date-transform';
import Coin from './coin.entity';

@Entity('wallet')
export default class Wallet {
  @PrimaryGeneratedColumn('uuid')
  address: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  cpf: string;

  @Column({
    nullable: false,
    type: 'date',
    transformer: { to: (value: string) => toDate(value), from: (value: Date) => value }
  })
  @Transform(({ value }) => toStringDate(value))
  birthdate: Date | string;

  @JoinTable()
  @OneToMany(() => Coin, (coin) => coin.wallet, { onDelete: 'CASCADE', cascade: true })
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
