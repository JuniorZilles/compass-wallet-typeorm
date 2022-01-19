import { EntityRepository, Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import CreateWalletDto from './dto/create-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import Wallet from './entities/wallet.entity';
import SearchPartialWalletDto from './dto/search-partial.dto';

@EntityRepository(Wallet)
export default class WalletRepository extends Repository<Wallet> {
  async findAll(payload: SearchWalletDto): Promise<Pagination<Wallet>> {
    const { page, limit, order, ...search } = payload;
    return paginate<Wallet>(
      this,
      { page, limit },
      {
        relations: ['coins', 'coins.transactions', 'coins.transactions.sendTo', 'coins.transactions.receiveFrom'],
        where: search,
        address: order
      }
    );
  }

  // async findAllV2(payload: SearchWalletDto): Promise<Pagination<Wallet>> {
  //   const { page, limit, order, ...search } = payload;

  //   const queryBuilder = this.buildQuery(search).orderBy('wallet.name', order);
  //   return paginate<Wallet>(queryBuilder, { page, limit });
  // }

  // private buildQuery(payload: SearchWalletDto): SelectQueryBuilder<Wallet> {
  //   const query = this.createQueryBuilder('wallet')
  //     .leftJoinAndSelect('wallet.coins', 'coins')
  //     .leftJoinAndSelect('coins.transactions', 'transactions')
  //     .leftJoinAndSelect('transactions.sendTo', 'sendTo')
  //     .leftJoinAndSelect('transactions.receiveFrom', 'receivedFrom');
  //   const keys = Object.keys(payload);
  //   const values = Object.values(payload);
  //   for (let i = 0; i < values.length; i += 1) {
  //     const key = keys[i];
  //     const content = { [key]: values[i] };
  //     if (['amount', 'coin'].includes(key)) {
  //       query.andWhere(`"coins"."${key}" = :${key}`, content);
  //     } else {
  //       query.andWhere(`"wallet"."${key}" = :${key}`, content);
  //     }
  //   }
  //   return query;
  // }

  async insertWallet(createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    const wallet = this.create(createWalletDto);
    await this.save(wallet);
    return wallet;
  }

  async findOneWallet(payload: SearchPartialWalletDto): Promise<Wallet> {
    const result = await this.findOne(payload, {
      relations: ['coins', 'coins.transactions', 'coins.transactions.sendTo', 'coins.transactions.receiveFrom']
    });
    return result;
  }
}
