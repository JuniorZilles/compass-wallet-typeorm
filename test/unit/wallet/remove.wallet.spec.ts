import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { getGenerated, MOCKWALLETREPOSITORY } from '../../utils/mocks/repos.mock';
import addressFactory from '../../utils/factory/address.factory';

describe('scr :: api :: wallet :: WalletService() :: remove', () => {
  describe('GIVEN a mocked repository AND 5 mocked registers', () => {
    let service: WalletService;
    const walletGen = getGenerated(3);
    const { address } = walletGen;
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WalletRepository, WalletService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
        .compile();

      service = module.get<WalletService>(WalletService);
    });
    describe('WHEN removing a specific wallet that exists', () => {
      it('THEN it should return the removed wallet', async () => {
        const wallet = await service.remove(address);
        expect(wallet).toEqual({
          address: expect.any(String),
          birthdate: expect.any(String),
          cpf: expect.any(String),
          created_at: expect.any(Date),
          name: expect.any(String),
          updated_at: expect.any(Date)
        });

        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith(address);
        expect(MOCKWALLETREPOSITORY.remove).toHaveBeenCalledWith(walletGen);
      });
    });

    describe('WHEN removing a specific that do not exists', () => {
      it('THEN it should throw a error', async () => {
        try {
          await service.remove(addressFactory);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Wallet not found for the used address.');
        }
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith(addressFactory);
      });
    });
  });
});
