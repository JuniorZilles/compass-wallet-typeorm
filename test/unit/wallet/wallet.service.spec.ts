import { Test, TestingModule } from '@nestjs/testing';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';

describe('scr :: api :: wallet :: WalletService()', () => {
  describe('GIVEN a context that a Module is not instantiated', () => {
    describe('WHEN the Module is instantiated just with the provider WalletService', () => {
      let service: WalletService;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [WalletRepository, CoinsRepository, TransactionRepository, WalletService]
        })
          .overrideProvider(WalletRepository)
          .useValue({})
          .overrideProvider(CoinsRepository)
          .useValue({})
          .overrideProvider(TransactionRepository)
          .useValue({})
          .compile();

        service = module.get<WalletService>(WalletService);
      });

      it('THEN the WalletService should be defined', () => {
        expect(service).toBeDefined();
      });

      it('THEN the WalletService should have a findAll method', () => {
        expect(service).toHaveProperty('findAll');
      });

      it('THEN the WalletService should have a findOne method', () => {
        expect(service).toHaveProperty('findOne');
      });

      it('THEN the WalletService should have a create method', () => {
        expect(service).toHaveProperty('create');
      });

      it('THEN the WalletService should have a update method', () => {
        expect(service).toHaveProperty('executeTransaction');
      });

      it('THEN the WalletService should have a remove method', () => {
        expect(service).toHaveProperty('remove');
      });
    });
  });
});
