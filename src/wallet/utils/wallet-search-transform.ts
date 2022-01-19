import SearchWalletDto from '../dto/search-wallet.dto';
import { toDate } from './date-transform';

export default (query: SearchWalletDto): SearchWalletDto => {
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
