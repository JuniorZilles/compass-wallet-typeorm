import { EntityRepository, Repository } from 'typeorm';
import Coin from './entities/coin.entity';

@EntityRepository(Coin)
export default class CoinsRepository extends Repository<Coin> {}
