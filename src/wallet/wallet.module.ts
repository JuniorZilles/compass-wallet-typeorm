import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import WalletService from './wallet.service';
import WalletController from './wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [TransactionModule]
})
export default class WalletModule {}
