import SearchWalletDto from '../dto/search-wallet.dto';
import { toDate } from './date-transform';

export default (query: SearchWalletDto): SearchWalletDto => {
  if (query.coin) {
    query['coins.coin'] = query.coin;
    delete query.coin;
  }
  if (query.amount) {
    query['coins.amount'] = query.amount;
    delete query.amount;
  }
  if (query.createdAt) {
    query.createdAt = toDate(query.createdAt as string);
  }
  if (query.updatedAt) {
    query.updatedAt = toDate(query.updatedAt as string);
  }
  if (query.birthdate) {
    query.birthdate = toDate(query.birthdate as string);
  }
  return query;
};
