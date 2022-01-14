import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import BadRequestErrorDto from '../../dto/bad-request.dto';
import ErrorDto from '../../dto/error.dto';
import TransactionService from './transaction.service';
import CreateTransactionDto from './dto/create-transaction.dto';
import ListCoinsDto from '../dto/list-coins.dto';
import SearchTransactionDto from './dto/search-transaction.dto';

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
  @ApiCreatedResponse({ type: ListCoinsDto })
  create(
    @Param('address', ParseUUIDPipe) address: string,
    @Body() createTransactionDto: CreateTransactionDto
  ): Promise<ListCoinsDto> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListCoinsDto })
  findAll(
    @Param('address', ParseUUIDPipe) address: string,
    @Query() payload: SearchTransactionDto
  ): Promise<ListCoinsDto> {
    return this.transactionService.findAll(payload);
  }
}
