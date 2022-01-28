import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import WalletRepository from '../../../../src/wallet/wallet.repository';
import addressFactory from '../../../utils/factory/address.factory';
import transactionFactory from '../../../utils/factory/transaction.factory';
import { getGenerated, MOCKWALLETREPOSITORY } from '../../../utils/mocks/repos.mock';
import CoinsRepository from '../../../../src/wallet/coins.repository';
import TransactionRepository from '../../../../src/wallet/transaction/transaction.repository';
import TransactionService from '../../../../src/wallet/transaction/transaction.service';

describe('scr :: api :: wallet :: transaction :: TransactionService()', () => {
  describe('GIVEN a mocked repository', () => {
    let service: TransactionService;
    let walletSend = getGenerated(3);
    let walletReci = getGenerated(4);
    const transaction = transactionFactory({});
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [WalletRepository, CoinsRepository, TransactionRepository, TransactionService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
        .overrideProvider(CoinsRepository)
        .useValue({})
        .overrideProvider(TransactionRepository)
        .useValue({})
        .compile();

      service = module.get<TransactionService>(TransactionService);
      walletSend = getGenerated(3);
      walletReci = getGenerated(4);
    });

    describe('WHEN user makes a valid action of transfer', () => {
      it('THEN should return the handled coin AND its transaction', async () => {
        const result = await service.create(walletSend.address, {
          receiverAddress: walletReci.address,
          ...transaction
        });
        expect(result).toEqual({
          coins: expect.arrayContaining([
            {
              amount: expect.any(Number),
              coin: expect.any(String),
              fullname: expect.any(String),
              id: expect.any(String),
              transactions: expect.arrayContaining([
                {
                  currentCotation: expect.any(Number),
                  datetime: expect.any(Date),
                  id: expect.any(String),
                  receiveFrom: expect.any(String),
                  sendTo: expect.any(String),
                  value: expect.any(Number)
                }
              ]),
              wallet: expect.any(String)
            }
          ])
        });
      });
    });

    describe('WHEN user makes a transfer to a wallet', () => {
      describe('AND the used coin is not registered for the target wallet', () => {
        it('THEN should create the entry of the coin with a transaction', async () => {
          const trans = transactionFactory({ quoteTo: 'PLN' });
          const result = await service.create(walletSend.address, {
            receiverAddress: walletReci.address,
            ...trans
          });
          expect(result.coins).toHaveLength(1);
          expect(result.coins[0].coin).toBe('PLN');
          const content = result.coins[0].transactions.filter((event) => {
            if (
              event.value === trans.value &&
              event.sendTo.address === walletReci.address &&
              event.sendTo.address === walletSend.address
            ) {
              return true;
            }
            return false;
          });
          expect(content).toHaveLength(1);
        });
      });

      describe('AND the used coin is registered', () => {
        it('THEN the current amount of the specified coin should be increased AND a new transaction created for the specified coin', async () => {
          const result = await service.create(walletSend.address, {
            receiverAddress: walletReci.address,
            ...transaction
          });
          expect(result.coins).toHaveLength(1);
          expect(result.coins[0].coin).toBe(transaction.quoteTo);
          const content = result.coins[0].transactions.filter((event) => {
            if (
              event.value === transaction.value &&
              event.sendTo.address === walletReci.address &&
              event.sendTo.address === walletSend.address
            ) {
              return true;
            }
            return false;
          });
          expect(content).toHaveLength(1);
        });
      });

      describe('AND does not have enough money', () => {
        it('THEN it should not execute the transaction', async () => {
          try {
            const trans = transactionFactory({ quoteTo: 'ETH' });
            await service.create(walletSend.address, {
              receiverAddress: walletReci.address,
              ...trans
            });
          } catch (e) {
            expect(e).toBeInstanceOf(BadRequestException);
            expect((<BadRequestException>e).name).toBe('NotFoundException');
            expect((<BadRequestException>e).message).toBe('Conversion from ABC to USD not found.');
          }
          // expect(MOCKCOINREPOSITORY.).toHaveBeenCalledWith({ address });
        });
      });
    });

    describe('WHEN user executes a transfer to a wallet that do not exists', () => {
      it('THEN it should throw a error', async () => {
        try {
          await service.create(walletSend.address, {
            receiverAddress: addressFactory,
            quoteTo: 'USD',
            currentCoin: 'BRL',
            value: 1.2
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Conversion from ABC to USD not found.');
        }
        // expect(MOCKCOINREPOSITORY.).toHaveBeenCalledWith({ address });
      });
    });

    describe('WHEN the requested user does not exist and try to make a transfer', () => {
      it('THEN it should throw a error', async () => {
        try {
          await service.create(addressFactory, {
            ...transaction,
            receiverAddress: walletReci.address
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Conversion from ABC to USD not found.');
        }
        // expect(MOCKCOINREPOSITORY.).toHaveBeenCalledWith({ address });
      });
    });

    describe('WHEN user try"s to convert a coin from a not existent', () => {
      it('THEN it should throw not found', async () => {
        try {
          await service.create(walletSend.address, {
            ...transaction,
            receiverAddress: walletReci.address,
            currentCoin: 'ABC'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Conversion from ABC to USD not found.');
        }
        // expect(MOCKCOINREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
      });
    });
  });
});
