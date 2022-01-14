import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class TransactionWalletDto {
  @ApiProperty({
    description: 'Destiny coin',
    required: false
  })
  @IsNotEmpty()
  @IsString()
  quoteTo: string;

  @ApiProperty({
    description: 'Used coin that should be used to convert',
    required: false
  })
  @IsNotEmpty()
  @IsString()
  currentCoin: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    required: false
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
