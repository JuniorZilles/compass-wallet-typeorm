import { PartialType } from '@nestjs/swagger';
import CreateTransactionDto from './create-transaction.dto';

export default class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
