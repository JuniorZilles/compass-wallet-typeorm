import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionModule from './transaction/transaction.module';
import WalletService from './wallet.service';
import WalletController from './wallet.controller';
import WalletRepository from './wallet.repository';
import CoinsRepository from './coins.repository';
import TransactionRepository from './transaction/transaction.repository';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [TypeOrmModule.forFeature([WalletRepository, CoinsRepository, TransactionRepository]), TransactionModule]
})
export default class WalletModule {}
