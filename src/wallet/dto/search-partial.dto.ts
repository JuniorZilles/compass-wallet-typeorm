import { PickType } from '@nestjs/swagger';
import SearchWalletDto from './search-wallet.dto';

export default class SearchPartialWalletDto extends PickType(SearchWalletDto, ['cpf', 'address']) {}
