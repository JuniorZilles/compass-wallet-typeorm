import { EntityRepository, Repository } from 'typeorm';
import CreateWalletDto from './dto/create-wallet.dto';
import SearchWalletDto from './dto/search-wallet.dto';
import Wallet from './entities/wallet.entity';

@EntityRepository(Wallet)
export default class WalletRepository extends Repository<Wallet> {
  async insertWallet(createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    const wallet = this.create(createWalletDto);
    await this.save(wallet);
    return wallet;
  }

  async findOneWallet(payload: SearchWalletDto): Promise<Wallet> {
    const result = await this.findOne(payload, { relations: ['coins'] });
    return result;
  }

  async removeWallet(address: string): Promise<Wallet> {
    const result = await this.delete(address);
    if (result.affected > 0) {
      return result.raw;
    }
    return null;
  }
}
