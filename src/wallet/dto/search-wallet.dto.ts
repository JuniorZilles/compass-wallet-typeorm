import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, Validate } from 'class-validator';
import PageDto from 'src/dto/page.dto';
import CustomCpfValidator from '../utils/validators/custom-cpf-validator';
import CustomDateIsOlderAgeValidator from '../utils/validators/custom-date-age-validator';
import CustomDateValidator from '../utils/validators/custom-date-validator';

export default class SearchWalletDto extends PageDto {
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
  birthdate?: string | Date;

  @ApiProperty({
    description: 'Amount of the transaction',
    format: 'DD/MM/YYYY',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'Currency code',
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  @MinLength(3)
  coin?: string;

  @ApiProperty({
    description: 'Creation date',
    format: 'DD/MM/YYYY',
    type: String,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @Validate(CustomDateValidator)
  createdAt?: string | Date;

  @ApiProperty({
    description: 'Update date',
    format: 'DD/MM/YYYY',
    type: String,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @Validate(CustomDateValidator)
  updatedAt?: string | Date;

  address?: string;
}
