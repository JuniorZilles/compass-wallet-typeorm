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

  async findOneWallet(payload: SearchWalletDto): Promise<CreateWalletDto> {
    const result = await this.findOne(payload);
    return result;
  }
}
