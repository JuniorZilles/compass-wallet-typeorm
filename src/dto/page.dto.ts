import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export default class PageDto {
  @ApiProperty({
    description: 'Retrieved page',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page? = 1;

  @ApiProperty({
    description: 'Amount of retrieved pages',
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
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
