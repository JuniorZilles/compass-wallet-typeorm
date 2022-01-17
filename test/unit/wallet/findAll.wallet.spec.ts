import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { MOCKWALLETREPOSITORY } from '../../utils/mocks/repos.mock';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';

describe('scr :: api :: wallet :: WalletService() :: findAll', () => {
  describe('GIVEN a mocked repository AND 5 mocked registers', () => {
    let service: WalletService;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WalletRepository, CoinsRepository, TransactionRepository, WalletService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
        .overrideProvider(CoinsRepository)
        .useValue({})
        .overrideProvider(TransactionRepository)
        .useValue({})
        .compile();

      service = module.get<WalletService>(WalletService);
    });

    describe('WHEN searching for a specific coin', () => {
      it('THEN it should return all wallets that have the requested coin', async () => {});
    });

    describe('WHEN searching for a specific name', () => {
      it('THEN it should return all wallets that have the requested name', async () => {});
    });

    describe('WHEN searching for a coin that do not exists', () => {
      it('THEN it should return a empty result', async () => {});
    });

    describe('WHEN searching using pagination taking 2 items AND requesting the second page', () => {
      it('THEN it should return 2 registers with pagination info informing that actual page of the request', async () => {});
    });
  });
});
