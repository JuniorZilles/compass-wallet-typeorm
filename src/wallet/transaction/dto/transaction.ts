import { ApiProperty } from '@nestjs/swagger';

export default class TransactionDto {
  @ApiProperty({
    description: 'Value of the transaction'
  })
  value: number;

  @ApiProperty({
    description: 'Date of the transaction'
  })
  datetime: Date;

  @ApiProperty({
    description: 'Wallet to send value'
  })
  sendTo: string;

  @ApiProperty({
    description: 'Wallet to receive value'
  })
  receiveFrom: string;

  @ApiProperty({
    description: 'Current cotation of the coin'
  })
  currentCotation: number;
}
