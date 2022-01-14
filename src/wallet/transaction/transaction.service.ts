import { Injectable } from '@nestjs/common';
import ListCoinsDto from '../dto/list-coins.dto';
import CreateTransactionDto from './dto/create-transaction.dto';
import SearchTransactionDto from './dto/search-transaction.dto';

@Injectable()
export default class TransactionService {
  async create(createTransactionDto: CreateTransactionDto): Promise<ListCoinsDto> {
    return new ListCoinsDto();
  }

  async findAll(payload: SearchTransactionDto): Promise<ListCoinsDto> {
    return new ListCoinsDto();
  }
}
