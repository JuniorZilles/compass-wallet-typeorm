import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export default class PageDto {
  @ApiProperty({
    description: 'Retrieved page',
    required: false
  })
  @IsOptional()
  @IsNumber()
  page? = 1;

  @ApiProperty({
    description: 'Amount of retrieved pages',
    required: false
  })
  @IsOptional()
  @IsNumber()
  limit? = 10;

  @ApiProperty({
    description: 'Order of the results',
    required: false
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
