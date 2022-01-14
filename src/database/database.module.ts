import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Coin from '../wallet/entities/coin.entity';
import Transaction from '../wallet/transaction/entities/transaction.entity';
import Wallet from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : ['.env']
    }),
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Wallet, Coin, Transaction],
      autoLoadEntities: process.env.NODE_ENV === 'test',
      synchronize: process.env.NODE_ENV === 'test',
      logging: false
    })
  ]
})
export default class DatabaseModule {}
