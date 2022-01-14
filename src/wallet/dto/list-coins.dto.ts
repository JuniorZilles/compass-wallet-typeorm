import { ApiProperty } from '@nestjs/swagger';
import Coin from '../entities/coin.entity';

export default class ListCoinsDto {
  @ApiProperty({
    description: 'List of the coins of a wallet',
    isArray: true,
    type: () => Coin
  })
  coins: Coin[];
}
