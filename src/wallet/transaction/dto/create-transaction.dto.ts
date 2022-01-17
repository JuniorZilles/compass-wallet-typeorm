import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

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
  @MaxLength(4)
  @MinLength(3)
  quoteTo: string;

  @ApiProperty({
    description: 'Coin with the original amount to be converted to quoteTo'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  @MinLength(3)
  currentCoin: string;

  @ApiProperty({
    description: 'Value to be transferred'
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
