import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { getGenerated, MOCKWALLETREPOSITORY } from '../../utils/mocks/repos.mock';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';

describe('scr :: api :: wallet :: WalletService() :: findAll', () => {
  describe('GIVEN a mocked repository AND 5 mocked registers', () => {
    let service: WalletService;
    const wallet = getGenerated(3);
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

    describe('WHEN searching with empty parameters', () => {
      it('THEN it should return all wallets following a structure', async () => {
        const result = await service.findAll({});

        expect(result).toEqual({
          wallet: expect.arrayContaining([
            {
              address: expect.any(String),
              birthdate: expect.any(String),
              coins: expect.arrayContaining([
                {
                  amount: expect.any(Number),
                  coin: expect.any(String),
                  fullname: expect.any(String),
                  transactions: expect.arrayContaining([
                    {
                      currentCotation: expect.any(Number),
                      datetime: expect.any(Date),
                      receiveFrom: expect.any(String),
                      sendTo: expect.any(String),
                      value: expect.any(Number)
                    }
                  ])
                }
              ]),
              cpf: expect.any(String),
              createdAt: expect.any(Date),
              name: expect.any(String),
              updatedAt: expect.any(Date)
            }
          ]),
          meta: expect.objectContaining({
            currentPage: expect.any(Number),
            itemCount: expect.any(Number),
            itemsPerPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number)
          })
        });

        expect(result.wallet).toHaveLength(10);
      });
    });

    describe('WHEN searching for a specific coin', () => {
      it('THEN it should return all wallets that have the requested coin', async () => {
        const { coin } = wallet.coins[0];
        const result = await service.findAll({ coin });

        expect(result.wallet).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.wallet.length).toBeGreaterThanOrEqual(1);
        result.wallet.forEach((itemWallet) => {
          let count = 0;
          itemWallet.coins.forEach((itemCoin) => {
            if (itemCoin.coin === coin) {
              count += 1;
            }
          });
          expect(count).toEqual(1);
        });
      });
    });

    describe('WHEN searching for a specific name', () => {
      it('THEN it should return all wallets that have the requested name', async () => {
        const { name } = wallet;
        const result = await service.findAll({ name });

        expect(result.wallet).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.wallet.length).toBeGreaterThanOrEqual(1);
        result.wallet.forEach((itemWallet) => {
          expect(itemWallet.name).toEqual(name);
        });
        expect(result.meta.itemCount).toEqual(result.wallet.length);
      });
    });

    describe('WHEN searching for a coin that do not exists', () => {
      it('THEN it should return a empty result', async () => {
        const result = await service.findAll({ coin: 'TRY' });

        expect(result.wallet).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.wallet).toHaveLength(0);
      });
    });

    describe('WHEN searching using pagination taking 2 items AND requesting the second page', () => {
      it('THEN it should return 2 registers with pagination info informing that actual page of the request', async () => {
        const result = await service.findAll({ limit: 2, page: 2 });

        expect(result.wallet).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.wallet).toHaveLength(2);
        expect(result.meta.currentPage).toEqual(2);
        expect(result.meta.itemCount).toEqual(2);
        expect(result.meta.totalPages).toBeDefined();
      });
    });
  });
});
