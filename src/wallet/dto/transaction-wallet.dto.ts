import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export default class TransactionWalletDto {
  @ApiProperty({
    description: 'Destiny coin',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  quoteTo: string;

  @ApiProperty({
    description: 'Used coin that should be used to convert',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  currentCoin: string;

  @ApiProperty({
    description: 'Amount of the transaction',
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
