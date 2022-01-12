import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength, Validate } from 'class-validator';
import CustomCpfValidator from '../utils/validators/custom-cpf-validator';
import CustomDateIsOlderAgeValidator from '../utils/validators/custom-date-validator';

export default class SearchWalletDto {
  @ApiProperty({
    description: 'Person Name',
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  name?: string;

  @ApiProperty({
    description: 'CPF of the person',
    format: 'XXX.XXX.XXX-XX',
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @Validate(CustomCpfValidator)
  cpf?: string;

  @ApiProperty({
    description: 'BirthDate of the person',
    format: 'DD/MM/YYYY',
    type: String,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @Validate(CustomDateIsOlderAgeValidator)
  birthdate?: Date;
}
