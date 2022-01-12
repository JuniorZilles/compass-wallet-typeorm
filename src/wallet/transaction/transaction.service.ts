import { Injectable } from '@nestjs/common';
import CreateTransactionDto from './dto/create-transaction.dto';

@Injectable()
export default class TransactionService {
  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }
}
