import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  ParseUUIDPipe
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import BadRequestErrorDto from '../../dto/bad-request.dto';
import ErrorDto from '../../dto/error.dto';
import TransactionService from './transaction.service';
import CreateTransactionDto from './dto/create-transaction.dto';
import ListTransactionDto from './dto/list-transactions';

@ApiTags('wallet.transaction')
@Controller({ path: '/wallet/:address/transaction', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
@ApiBadRequestResponse({ description: 'Bad Request.', type: BadRequestErrorDto })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.', type: ErrorDto })
export default class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiBody({ type: CreateTransactionDto })
  create(@Param('address', ParseUUIDPipe) address: string, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListTransactionDto })
  findAll(@Param('address', ParseUUIDPipe) address: string) {
    return this.transactionService.findAll();
  }
}
