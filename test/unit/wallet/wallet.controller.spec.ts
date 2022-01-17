import { Test, TestingModule } from '@nestjs/testing';
import CoinsRepository from '../../../src/wallet/coins.repository';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletController from '../../../src/wallet/wallet.controller';
import WalletService from '../../../src/wallet/wallet.service';

describe('scr :: api :: wallet :: WalletController()', () => {
  describe('GIVEN a context that WalletModule is not instantiated', () => {
    describe('WHEN the WalletModule is instantiated', () => {
      let controller: WalletController;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [WalletController],
          providers: [WalletRepository, CoinsRepository, TransactionRepository, WalletService]
        })
          .overrideProvider(WalletRepository)
          .useValue({})
          .overrideProvider(CoinsRepository)
          .useValue({})
          .overrideProvider(TransactionRepository)
          .useValue({})
          .compile();

        controller = module.get<WalletController>(WalletController);
      });

      it('THEN the WalletController should be defined', () => {
        expect(controller).toBeDefined();
      });

      it('THEN the WalletController should have a findAll method', () => {
        expect(controller).toHaveProperty('findAll');
      });

      it('THEN the WalletController should have a findOne method', () => {
        expect(controller).toHaveProperty('findOne');
      });

      it('THEN the WalletController should have a create method', () => {
        expect(controller).toHaveProperty('create');
      });

      it('THEN the WalletController should have a update method', () => {
        expect(controller).toHaveProperty('update');
      });

      it('THEN the WalletController should have a remove method', () => {
        expect(controller).toHaveProperty('remove');
      });
    });
  });
});
