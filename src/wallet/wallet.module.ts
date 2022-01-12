import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionModule from './transaction/transaction.module';
import WalletService from './wallet.service';
import WalletController from './wallet.controller';
import WalletRepository from './wallet.repository';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [TypeOrmModule.forFeature([WalletRepository]), TransactionModule]
})
export default class WalletModule {}
