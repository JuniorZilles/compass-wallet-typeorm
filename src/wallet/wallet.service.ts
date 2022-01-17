import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CoinsRepository from './coins.repository';
import CreateWalletDto from './dto/create-wallet.dto';
import ListCoinsDto from './dto/list-coins.dto';
import ListWalletDto from './dto/list-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import TransactionWalletDto from './dto/transaction-wallet.dto';
import Wallet from './entities/wallet.entity';
import TransactionRepository from './transaction/transaction.repository';
import getConversion from './utils/coin-request';
import { toDate } from './utils/date-transform';
import WalletRepository from './wallet.repository';

@Injectable()
export default class WalletService {
  constructor(
    @InjectRepository(WalletRepository) private readonly walletRepo: WalletRepository,
    @InjectRepository(CoinsRepository) private readonly coinRepo: CoinsRepository,
    @InjectRepository(TransactionRepository) private readonly transactionRepo: TransactionRepository
  ) {}

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

  async findOne(address: string): Promise<Wallet> {
    const result = await this.walletRepo.findOneWallet({ address });
    if (!result || Object.keys(result).length === 0) {
      throw new NotFoundException('Wallet not found for the searched address.');
    }
    return result;
  }

  async executeTransaction(address: string, transactionWalletDto: TransactionWalletDto[]): Promise<ListCoinsDto> {
    const wallet = await this.findOne(address);
    const transactions = await Promise.all(
      transactionWalletDto.map(async (transaction) => {
        const { quoteTo, currentCoin, value } = transaction;
        const coin = await this.coinRepo.findCoin(transaction.quoteTo, wallet);
        const cotation = await getConversion(currentCoin, quoteTo);
        const transacValue = value * Number(cotation.bid);
        if (!coin) {
          if (transacValue > 0) {
            return this.coinRepo.create({
              coin: transaction.quoteTo,
              amount: transacValue,
              wallet,
              fullname: cotation.name.split('/')[0],
              transactions: [
                {
                  receiveFrom: wallet,
                  sendTo: wallet,
                  value,
                  currentCotation: Number(cotation.bid)
                }
              ]
            });
          }
          throw new BadRequestException(`Insufficient funds for ${quoteTo}.`);
        } else if (transacValue + coin.amount < 0) {
          throw new BadRequestException(`Insufficient funds for ${quoteTo}.`);
        } else {
          coin.amount += transacValue;
          coin.transactions.push(
            this.transactionRepo.create({
              receiveFrom: wallet,
              sendTo: wallet,
              value,
              currentCotation: Number(cotation.bid)
            })
          );
          return coin;
        }
      })
    );
    await Promise.all(
      transactions.map(async (transaction) => {
        await this.coinRepo.save(transaction);
      })
    );
    return { coins: transactions };
  }

  async remove(address: string): Promise<Wallet> {
    const wallet = await this.findOne(address);
    const result = await this.walletRepo.remove(wallet);
    if (!result) {
      throw new NotFoundException('Wallet not removed.');
    }
    return result;
  }
}
