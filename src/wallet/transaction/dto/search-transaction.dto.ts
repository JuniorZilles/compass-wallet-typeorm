import { ApiProperty } from '@nestjs/swagger';

export default class SearchTransactionDto {
  @ApiProperty({
    description: 'Selected coin',
    required: false
  })
  coin: string;

  @ApiProperty({
    description: 'BirthDate of the person',
    format: 'DD/MM/YYYY',
    type: String,
    required: false
  })
  initialDate: Date | string;

  @ApiProperty({
    description: 'BirthDate of the person',
    format: 'DD/MM/YYYY',
    type: String,
    required: false
  })
  finalDate: Date | string;
}
