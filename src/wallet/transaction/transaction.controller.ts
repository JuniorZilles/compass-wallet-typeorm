import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import ErrorDto from '../../dto/error.dto';
import TransactionService from './transaction.service';
import CreateTransactionDto from './dto/create-transaction.dto';
import UpdateTransactionDto from './dto/update-transaction.dto';

@ApiTags('wallet.transaction')
@Controller({ path: '/wallet/:address/transaction', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiBadRequestResponse({ description: 'Bad Request.', type: ErrorDto })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.', type: ErrorDto })
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
