import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import CoinsRepository from '../../../src/wallet/coins.repository';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletService from '../../../src/wallet/wallet.service';
import {
  MOCKWALLETREPOSITORY,
  getGenerated,
  renewWallet,
  MOCKCOINREPOSITORY,
  MOCKTRANSACTIONREPOSITORY
} from '../../utils/mocks/repos.mock';
import addressFactory from '../../utils/factory/address.factory';
import transactionFactory from '../../utils/factory/transaction.factory';
import TransactionRepository from '../../../src/wallet/transaction/transaction.repository';

describe('scr :: api :: wallet :: WalletService() :: executeTransaction', () => {
  describe('GIVEN a mocked repository', () => {
    let service: WalletService;
    let wallet = getGenerated(3);
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: ['.env.test']
          })
        ],
        providers: [WalletRepository, CoinsRepository, TransactionRepository, WalletService]
      })
        .overrideProvider(WalletRepository)
        .useValue(MOCKWALLETREPOSITORY)
        .overrideProvider(CoinsRepository)
        .useValue(MOCKCOINREPOSITORY)
        .overrideProvider(TransactionRepository)
        .useValue(MOCKTRANSACTIONREPOSITORY)
        .compile();

      service = module.get<WalletService>(WalletService);
      renewWallet();
      wallet = getGenerated(3);
    });

    describe('WHEN user makes a valid action to a wallet', () => {
      it('THEN should return all handled coins AND its transactions', async () => {
        const result = await service.executeTransaction(wallet.address, [transactionFactory({})]);
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

    describe('WHEN user makes a deposit to a wallet AND the used coin is not registered for the wallet', () => {
      it('THEN should create the entry of the coin with a transaction', async () => {
        const transaction = transactionFactory({});
        const { coins, address } = wallet;
        const coinFind = coins.find((coin) => coin.coin === transaction.quoteTo);
        if (coinFind) {
          transaction.quoteTo = 'IQD';
        }
        const result = await service.executeTransaction(address, [transaction]);
        expect(result.coins).toHaveLength(1);
        expect(result.coins[0].amount).toBeGreaterThan(0);
        expect(result.coins[0].coin).toBe(transaction.quoteTo);
        expect(result.coins[0].transactions).toHaveLength(1);
        expect(result.coins[0].transactions[0].receiveFrom).toBe(wallet.address);
        expect(result.coins[0].transactions[0].sendTo).toBe(wallet.address);
        expect(result.coins[0].transactions[0].value).toBe(transaction.value);
        expect(result.coins[0].transactions[0].datetime).toBeDefined();
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address: wallet.address });
        expect(MOCKCOINREPOSITORY.create).toHaveBeenCalled();
      });
    });

    describe('WHEN user makes a deposit to a wallet to a registered coin', () => {
      it('THEN the current amount of the specified coin should be increased AND a new transaction created for the specified coin', async () => {
        const { coins, address } = wallet;
        const transaction = transactionFactory({ quoteTo: coins[0].coin });
        const trans = coins[0].transactions.length;
        const result = await service.executeTransaction(address, [transaction]);
        expect(result.coins).toHaveLength(1);
        expect(result.coins[0].amount).toBeGreaterThanOrEqual(coins[0].amount);
        expect(result.coins[0].coin).toBe(coins[0].coin);
        expect(result.coins[0].transactions).toHaveLength(trans + 1);
        expect(result.coins[0].transactions.at(-1).receiveFrom).toBe(address);
        expect(result.coins[0].transactions.at(-1).sendTo).toBe(address);
        expect(result.coins[0].transactions.at(-1).value).toBe(transaction.value);
        expect(result.coins[0].transactions.at(-1).datetime).toBeDefined();
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
        expect(MOCKCOINREPOSITORY.create).toHaveBeenCalled();
      });
    });

    describe('WHEN user makes a withdraw from a coin of the wallet', () => {
      it('THEN the current amount of the specified coin should be decreased AND a new transaction be created', async () => {
        const { coins, address } = wallet;
        const transaction = transactionFactory({ quoteTo: coins[0].coin, negative: true });
        coins[0].amount = 6000000;
        const { amount } = coins[0];
        const trans = coins[0].transactions.length;
        const result = await service.executeTransaction(address, [transaction]);
        expect(result.coins).toHaveLength(1);
        expect(result.coins[0].amount).toBeLessThan(amount);
        expect(result.coins[0].coin).toBe(coins[0].coin);
        expect(result.coins[0].transactions).toHaveLength(trans + 1);
        expect(result.coins[0].transactions.at(-1).receiveFrom).toBe(address);
        expect(result.coins[0].transactions.at(-1).sendTo).toBe(address);
        expect(result.coins[0].transactions.at(-1).value).toBe(transaction.value);
        expect(result.coins[0].transactions.at(-1).datetime).toBeDefined();
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
        expect(MOCKCOINREPOSITORY.create).toHaveBeenCalled();
      });
    });

    describe('WHEN user makes a deposit AND a withdraw at the same time', () => {
      it('THEN should create the entry of the coin with a transaction', async () => {
        const { coins, address } = wallet;
        const transactionA = transactionFactory({ quoteTo: coins[0].coin, negative: true });
        const transactionB = transactionFactory({ quoteTo: coins[1].coin });
        coins[0].amount = 6000000;
        const { amount } = coins[0];
        const transA = coins[0].transactions.length;
        const transB = coins[1].transactions.length;
        const result = await service.executeTransaction(address, [transactionA, transactionB]);
        expect(result.coins).toHaveLength(2);
        expect(result.coins[0].amount).toBeLessThan(amount);
        expect(result.coins[0].coin).toBe(coins[0].coin);
        expect(result.coins[0].transactions).toHaveLength(transA + 1);
        expect(result.coins[0].transactions.at(-1).receiveFrom).toBe(address);
        expect(result.coins[0].transactions.at(-1).sendTo).toBe(address);
        expect(result.coins[0].transactions.at(-1).value).toBe(transactionA.value);
        expect(result.coins[0].transactions.at(-1).datetime).toBeDefined();
        expect(result.coins[1].amount).toBeGreaterThanOrEqual(coins[1].amount);
        expect(result.coins[1].coin).toBe(coins[1].coin);
        expect(result.coins[1].transactions).toHaveLength(transB + 1);
        expect(result.coins[1].transactions.at(-1).receiveFrom).toBe(address);
        expect(result.coins[1].transactions.at(-1).sendTo).toBe(address);
        expect(result.coins[1].transactions.at(-1).value).toBe(transactionB.value);
        expect(result.coins[1].transactions.at(-1).datetime).toBeDefined();
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
        expect(MOCKCOINREPOSITORY.create).toHaveBeenCalled();
      });
    });

    describe('WHEN user makes a withdraw from a coin of the wallet AND does not have money on it', () => {
      it('THEN it should not execute the transaction', async () => {
        const { address } = wallet;
        try {
          const transaction = transactionFactory({ quoteTo: 'EUR', negative: true });
          await service.executeTransaction(address, [transaction]);
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException);
          expect((<BadRequestException>e).name).toBe('BadRequestException');
          expect((<BadRequestException>e).message).toBe('Insufficient funds for EUR.');
        }
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
        expect(MOCKCOINREPOSITORY.findOne).toHaveBeenCalled();
      });
    });

    describe('WHEN user executes action to a specific wallet that do not exists', () => {
      it('THEN it should throw a error', async () => {
        try {
          await service.executeTransaction(addressFactory, [transactionFactory({})]);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Wallet not found for the searched address.');
        }
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address: addressFactory });
      });
    });

    describe('WHEN user try"s to convert a coin from a not existent', () => {
      it('THEN it should throw not found', async () => {
        const { address } = wallet;
        try {
          await service.executeTransaction(address, [
            {
              quoteTo: 'USD',
              currentCoin: 'ABC',
              value: 1.2
            }
          ]);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect((<NotFoundException>e).name).toBe('NotFoundException');
          expect((<NotFoundException>e).message).toBe('Conversion from ABC to USD not found.');
        }
        expect(MOCKWALLETREPOSITORY.findOneWallet).toHaveBeenCalledWith({ address });
      });
    });
  });
});
