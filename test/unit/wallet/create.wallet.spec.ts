import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { oneWallet } from '../../utils/factory/wallet.factory';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { MOCKWALLETREPOSITORY, GENERATED } from '../../utils/mocks/wallet.repo.mock';

describe('scr :: api :: wallet :: WalletService()', () => {
  describe('GIVEN a mocked repository', () => {
    let service: WalletService;
    const walletFactory = oneWallet();
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WalletRepository, WalletService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
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
          created_at: expect.any(Date),
          name: expect.any(String),
          updated_at: expect.any(Date)
        });

        expect(MOCKWALLETREPOSITORY.insertWallet).toHaveBeenCalledWith(walletFactory);
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ cpf: walletFactory.cpf });
      });
    });

    describe('WHEN creating a new wallet with a existing CPF', () => {
      it('THEN the WalletService should throw a error', async () => {
        const wallet = { ...walletFactory, cpf: GENERATED[0].cpf };
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
