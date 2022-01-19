import { Test, TestingModule } from '@nestjs/testing';
import TransactionController from '../../../../src/wallet/transaction/transaction.controller';
import TransactionService from '../../../../src/wallet/transaction/transaction.service';

describe('scr :: api :: wallet :: transaction :: WalletController()', () => {
  describe('GIVEN a context that TransactionModule is not instantiated', () => {
    describe('WHEN the TransactionModule is instantiated', () => {
      let controller: TransactionController;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [TransactionController],
          providers: [TransactionService]
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
      });

      it('THEN the WalletController should be defined', () => {
        expect(controller).toBeDefined();
      });

      it('THEN the WalletController should have a findAll method', () => {
        expect(controller).toHaveProperty('findAll');
      });

      it('THEN the WalletController should have a create method', () => {
        expect(controller).toHaveProperty('create');
      });
    });
  });
});
