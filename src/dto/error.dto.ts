'statusCode';

import { ApiProperty } from '@nestjs/swagger';

export default class ErrorDto {
  @ApiProperty({
    description: 'Status code',
    readOnly: true
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error messages',
    readOnly: true
  })
  message: string[];

  @ApiProperty({
    description: 'Error title',
    readOnly: true
  })
  error: string;
}
