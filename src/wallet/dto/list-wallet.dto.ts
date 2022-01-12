import { ApiProperty } from '@nestjs/swagger';
import CreateWalletDto from './create-wallet.dto';

export default class ListWalletDto {
  @ApiProperty({
    description: 'List of selected wallets',
    isArray: true,
    type: () => CreateWalletDto
  })
  wallet: CreateWalletDto[];
}
