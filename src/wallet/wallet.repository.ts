import { EntityRepository, Repository } from 'typeorm';
import Wallet from './entities/wallet.entity';

@EntityRepository(Wallet)
export default class WalletRepository extends Repository<Wallet> {}
