import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export default class CreateTransactionDto {
  @ApiProperty({
    description: 'Person that will receive the transaction'
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  receiverAddress: string;

  @ApiProperty({
    description: 'Coin that will be used to make the transaction'
  })
  @IsNotEmpty()
  @IsString()
  quoteTo: string;

  @ApiProperty({
    description: 'Coin with the original amount to be converted to quoteTo'
  })
  @IsNotEmpty()
  @IsString()
  currentCoin: string;

  @ApiProperty({
    description: 'Value to be transferred'
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
