import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  ParseArrayPipe
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import BadRequestErrorDto from '../dto/bad-request.dto';
import ErrorDto from '../dto/error.dto';
import WalletService from './wallet.service';
import CreateWalletDto from './dto/create-wallet.dto';
import ListWalletDto from './dto/list-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import TransactionWalletDto from './dto/transaction-wallet.dto';
import ListCoinsDto from './dto/list-coins.dto';
import Wallet from './entities/wallet.entity';

@ApiTags('wallet')
@Controller({ path: '/wallet', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiBadRequestResponse({ description: 'Bad Request.', type: BadRequestErrorDto })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error.', type: ErrorDto })
export default class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiCreatedResponse({ description: 'The wallet was created.', type: CreateWalletDto })
  async create(@Body() createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    const result = await this.walletService.create(createWalletDto);
    return result;
  }

  @Get()
  @ApiQuery({ type: SearchWalletDto })
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListWalletDto })
  async findAll(@Query() payload: SearchWalletDto): Promise<ListWalletDto> {
    const result = await this.walletService.findAll(payload);
    return result;
  }

  @Get(':address')
  @ApiOkResponse({ description: 'Operation succeeded.', type: Wallet })
  @ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
  async findOne(@Param('address', ParseUUIDPipe) address: string): Promise<Wallet> {
    const result = await this.walletService.findOne(address);
    return result;
  }

  @Put(':address')
  @ApiBody({ type: TransactionWalletDto, isArray: true })
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListCoinsDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
  update(
    @Param('address', ParseUUIDPipe) address: string,
    @Body(new ParseArrayPipe({ items: TransactionWalletDto })) transactionWalletDto: TransactionWalletDto[]
  ): Promise<ListCoinsDto> {
    return this.walletService.executeTransaction(address, transactionWalletDto);
  }

  @Delete(':address')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Success on removing the wallet.', type: ErrorDto })
  @ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
  async remove(@Param('address', ParseUUIDPipe) address: string) {
    const result = await this.walletService.remove(address);
    return result;
  }
}
