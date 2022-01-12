import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import { MOCKWALLETREPOSITORY, GENERATED } from '../../utils/mocks/wallet.repo.mock';
import addressFactory from '../../utils/factory/address.factory';

describe('scr :: api :: wallet :: WalletService()', () => {
  describe('GIVEN a mocked repository AND 5 mocked registers', () => {
    let service: WalletService;
    const { address } = GENERATED[3];
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WalletRepository, WalletService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
        .compile();

      service = module.get<WalletService>(WalletService);
    });
    describe('WHEN searching for a specific wallet that exists', () => {
      it('THEN it should return the requested wallet', async () => {
        const wallet = await service.findOne(address);
        expect(wallet).toEqual({
          address: expect.any(String),
          birthdate: expect.any(Date),
          cpf: expect.any(String),
          created_at: expect.any(Date),
          name: expect.any(String),
          updated_at: expect.any(Date)
        });

        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
      });
    });

    describe('WHEN searching for a specific that do not exists', () => {
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
