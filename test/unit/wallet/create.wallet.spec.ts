import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createOneWallet } from '../../utils/factory/wallet.factory';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { getGenerated, MOCKWALLETREPOSITORY } from '../../utils/mocks/repos.mock';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';

describe('scr :: api :: wallet :: WalletService() :: create', () => {
  describe('GIVEN a mocked repository', () => {
    let service: WalletService;
    const walletFactory = createOneWallet();
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
    describe('WHEN creating a valid new wallet', () => {
      it('THEN the WalletService should return a new wallet', async () => {
        const wallet = await service.create(walletFactory);
        expect(wallet).toEqual({
          address: expect.any(String),
          birthdate: expect.any(Date),
          cpf: expect.any(String),
          createdAt: expect.any(Date),
          name: expect.any(String),
          updatedAt: expect.any(Date)
        });

        expect(MOCKWALLETREPOSITORY.insertWallet).toHaveBeenCalledWith(walletFactory);
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ cpf: walletFactory.cpf });
      });
    });

    describe('WHEN creating a new wallet with a existing CPF', () => {
      it('THEN the WalletService should throw a error', async () => {
        const generated = getGenerated(0);
        const wallet = { ...walletFactory, cpf: generated.cpf };
        try {
          await service.create(wallet);

          expect(MOCKWALLETREPOSITORY.insertWallet).toHaveBeenCalledWith(wallet);
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException);
          expect((<BadRequestException>e).name).toBe('BadRequestException');
          expect((<BadRequestException>e).message).toBe('Wallet already exists for this CPF.');
          expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ cpf: wallet.cpf });
        }
      });
    });
  });
});
