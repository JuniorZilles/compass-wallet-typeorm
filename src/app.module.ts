import { Module } from '@nestjs/common';
import WalletModule from './wallet/wallet.module';
import DatabaseModule from './database/database.module';

@Module({
  imports: [WalletModule, DatabaseModule]
})
export default class AppModule {}
