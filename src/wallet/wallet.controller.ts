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
  HttpStatus
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import ErrorDto from '../dto/error.dto';
import WalletService from './wallet.service';
import CreateWalletDto from './dto/create-wallet.dto';
import ListWalletDto from './dto/list-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';

@ApiTags('wallet')
@Controller({ path: '/wallet', version: '1' })
@UseInterceptors(ClassSerializerInterceptor)
@ApiBadRequestResponse({ description: 'Bad Request.', type: ErrorDto })
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
  @ApiOkResponse({ description: 'Operation succeeded.', type: ListWalletDto })
  findAll(@Query() payload: SearchWalletDto): ListWalletDto {
    return this.walletService.findAll(payload);
  }

  @Get(':address')
  @ApiOkResponse({ description: 'Operation succeeded.', type: CreateWalletDto })
  @ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
  async findOne(@Param('address', ParseUUIDPipe) address: string): Promise<CreateWalletDto> {
    const result = await this.walletService.findOne(address);
    return result;
  }

  @Put(':address')
  @ApiOkResponse({ description: 'Operation succeeded.', type: CreateWalletDto })
  @ApiNotFoundResponse({ description: 'Searched wallet was not found.', type: ErrorDto })
  update(@Param('address', ParseUUIDPipe) address: string, @Body() updateWalletDto: CreateWalletDto): CreateWalletDto {
    return this.walletService.update(address, updateWalletDto);
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
