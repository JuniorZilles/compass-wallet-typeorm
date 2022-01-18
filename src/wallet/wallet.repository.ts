import { EntityRepository, Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import CreateWalletDto from './dto/create-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import Wallet from './entities/wallet.entity';

@EntityRepository(Wallet)
export default class WalletRepository extends Repository<Wallet> {
  async findAll(payload: SearchWalletDto): Promise<Pagination<Wallet>> {
    const { page, limit, order, ...search } = payload;
    const queryBuilder = this.createQueryBuilder('w');
    queryBuilder.where(search);
    queryBuilder.orderBy('w.name', order);
    return paginate<Wallet>(queryBuilder, { page, limit });
  }

  async insertWallet(createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    const wallet = this.create(createWalletDto);
    await this.save(wallet);
    return wallet;
  }

  async findOneWallet(payload: SearchWalletDto): Promise<Wallet> {
    const result = await this.findOne(payload, {
      relations: ['coins', 'coins.transactions', 'coins.transactions.sendTo', 'coins.transactions.receiveFrom']
    });
    return result;
  }
}
