import { ApiProperty } from '@nestjs/swagger';
import Wallet from '../entities/wallet.entity';

export default class ListWalletDto {
  @ApiProperty({
    description: 'List of selected wallets',
    isArray: true,
    type: () => Wallet
  })
  wallet: Wallet[];
}
