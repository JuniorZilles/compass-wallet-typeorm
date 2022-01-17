import { EntityRepository, Repository } from 'typeorm';
import Coin from './entities/coin.entity';
import Wallet from './entities/wallet.entity';

@EntityRepository(Coin)
export default class CoinsRepository extends Repository<Coin> {
  async findCoin(quoteTo: string, wallet: Wallet) {
    const result = await this.findOne(
      { coin: quoteTo, wallet },
      { relations: ['transactions', 'transactions.sendTo', 'transactions.receiveFrom'] }
    );
    return result;
  }
}
