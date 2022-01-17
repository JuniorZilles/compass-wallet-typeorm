import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { getGenerated, MOCKWALLETREPOSITORY } from '../../utils/mocks/repos.mock';
import addressFactory from '../../utils/factory/address.factory';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';

describe('scr :: api :: wallet :: WalletService() :: findOne', () => {
  describe('GIVEN a mocked repository AND 5 mocked registers', () => {
    let service: WalletService;
    const { address } = getGenerated(3);
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
    describe('WHEN searching for a specific wallet that exists', () => {
      it('THEN it should return the requested wallet', async () => {
        const wallet = await service.findOne(address);
        expect(wallet).toEqual({
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
        });

        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
      });
    });

    describe('WHEN searching for a specific wallet that do not exists', () => {
      it('THEN it should throw a error', async () => {
        try {
          await service.findOne(addressFactory);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Wallet not found for the searched address.');
        }
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address: addressFactory });
      });
    });
  });
});
