import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import CustomCpfValidator from '../utils/validators/custom-cpf-validator';
import CustomDateIsOlderAgeValidator from '../utils/validators/custom-date-validator';

export default class CreateWalletDto {
  @ApiProperty({
    description: 'Person identifier Address',
    required: false,
    readOnly: true
  })
  address?: string;

  @ApiProperty({
    description: 'Person Name'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  name: string;

  @ApiProperty({
    description: 'CPF of the person',
    format: 'XXX.XXX.XXX-XX'
  })
  @IsNotEmpty()
  @Validate(CustomCpfValidator)
  cpf: string;

  @ApiProperty({
    description: 'BirthDate of the person',
    format: 'DD/MM/YYYY',
    type: String
  })
  @IsNotEmpty()
  @Validate(CustomDateIsOlderAgeValidator)
  birthdate: string | Date;
}
