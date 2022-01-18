import { ApiProperty } from '@nestjs/swagger';

export default class MetaDto {
  @ApiProperty({
    description: 'Amount of retrieved items'
  })
  itemCount: number;

  @ApiProperty({
    description: 'Total amount of items',
    required: false
  })
  totalItems?: number;

  @ApiProperty({
    description: 'Amount of items per page'
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total amount of pages',
    required: false
  })
  totalPages?: number;

  @ApiProperty({
    description: 'Actual page'
  })
  currentPage: number;
}
