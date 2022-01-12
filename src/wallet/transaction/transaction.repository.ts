import { EntityRepository, Repository } from 'typeorm';
import Transaction from './entities/transaction.entity';

@EntityRepository(Transaction)
export default class TransactionRepository extends Repository<Transaction> {}
