import { ApiProperty } from '@nestjs/swagger';
import TransactionDto from './transaction';

export default class ListTransactionDto {
  @ApiProperty({
    description: 'Selected coin'
  })
  coin: string;

  @ApiProperty({
    description: 'Coin fullname'
  })
  fullname: string;

  @ApiProperty({
    description: 'Coin amount'
  })
  amount: number;

  @ApiProperty({
    description: 'Coin that will be used to make the transaction',
    type: TransactionDto,
    isArray: true
  })
  transactions: TransactionDto[];
}
