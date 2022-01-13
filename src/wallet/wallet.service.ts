import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateWalletDto from './dto/create-wallet.dto';
import ListWalletDto from './dto/list-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import TransactionWalletDto from './dto/transaction-wallet.dto';
import { toDate } from './utils/date-transform';
import WalletRepository from './wallet.repository';

@Injectable()
export default class WalletService {
  constructor(@InjectRepository(WalletRepository) private readonly walletRepo: WalletRepository) {}

  async create(createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    const exist = await this.walletRepo.findOneWallet({ cpf: createWalletDto.cpf });
    if (exist) {
      throw new BadRequestException('Wallet already exists for this CPF.');
    }
    createWalletDto.birthdate = toDate(createWalletDto.birthdate as string);
    const wallet = await this.walletRepo.insertWallet(createWalletDto);
    return wallet;
  }

  findAll(payload: SearchWalletDto): ListWalletDto {
    return new ListWalletDto();
  }

  async findOne(address: string): Promise<CreateWalletDto> {
    const result = await this.walletRepo.findOneWallet({ address });
    if (!result || Object.keys(result).length === 0) {
      throw new NotFoundException('Wallet not found for the searched address.');
    }
    return result;
  }

  executeTransaction(address: string, updateWalletDto: TransactionWalletDto[]): TransactionWalletDto[] {
    return updateWalletDto;
  }

  async remove(address: string): Promise<CreateWalletDto> {
    const result = await this.walletRepo.removeWallet(address);
    if (!result) {
      throw new NotFoundException('Wallet not found for the used address.');
    }
    return result;
  }
}
