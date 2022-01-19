import { Test, TestingModule } from '@nestjs/testing';
import TransactionService from '../../../../src/wallet/transaction/transaction.service';

describe('scr :: api :: wallet :: transaction :: TransactionService()', () => {
  describe('GIVEN a context that a Module is not instantiated', () => {
    describe('WHEN the Module is instantiated just with the provider TransactionService', () => {
      let service: TransactionService;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [TransactionService]
        }).compile();

        service = module.get<TransactionService>(TransactionService);
      });

      it('THEN the TransactionService should be defined', () => {
        expect(service).toBeDefined();
      });

      it('THEN the TransactionService should have a findAll method', () => {
        expect(service).toHaveProperty('findAll');
      });

      it('THEN the TransactionService should have a findOne method', () => {
        expect(service).toHaveProperty('create');
      });
    });
  });
});
