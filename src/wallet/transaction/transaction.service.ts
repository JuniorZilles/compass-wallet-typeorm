import { Injectable } from '@nestjs/common';
import ListCoinsDto from '../dto/list-coins.dto';
import CreateTransactionDto from './dto/create-transaction.dto';
import SearchTransactionDto from './dto/search-transaction.dto';

@Injectable()
export default class TransactionService {
  async create(address: string, createTransactionDto: CreateTransactionDto): Promise<ListCoinsDto> {}

  async findAll(address: string, payload: SearchTransactionDto): Promise<ListCoinsDto> {
    return new ListCoinsDto();
  }
}
