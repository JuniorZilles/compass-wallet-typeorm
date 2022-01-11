import { PartialType } from '@nestjs/mapped-types';
import CreateWalletDto from './create-wallet.dto';

export default class UpdateWalletDto extends PartialType(CreateWalletDto) {}
