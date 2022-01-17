import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import Coin from '../../src/wallet/entities/coin.entity';
import addressFactory from '../utils/factory/address.factory';
import AppModule from '../../src/app.module';
import { oneWallet } from '../utils/factory/wallet.factory';
import transactionFactory from '../utils/factory/transaction.factory';

describe('scr :: api :: wallet :: WalletController() :: update (e2e)', () => {
  describe('GIVEN a existing wallet', () => {
    let app: INestApplication;
    const walletFactory = oneWallet();
    let address: string;
    const iniAmounts: number[] = [];
    const transactions = [
      transactionFactory({ quoteTo: 'PLN' }),
      transactionFactory({ quoteTo: 'BHD' }),
      transactionFactory({ quoteTo: 'IRR' }),
      transactionFactory({ quoteTo: 'GMD' })
    ];
    const transaction = transactionFactory({});
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

      app = moduleFixture.createNestApplication();

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true
        })
      );

      await app.init();
    });

    beforeEach(async () => {
      const response = await request(app.getHttpServer()).post('/wallet').send(walletFactory);

      expect(response.status).toBe(201);
      address = response.body.address;

      const responsePut = await request(app.getHttpServer()).put(`/wallet/${address}`).send(transactions);
      if (responsePut.status !== 200) {
        console.log(responsePut.body);
      }
      expect(responsePut.status).toBe(200);

      responsePut.body.coins.forEach((coin: Coin) => {
        iniAmounts.push(coin.amount);
      });
    });

    afterAll(async () => {
      await app.close();
    });

    describe('WHEN requested to make a deposit to a wallet / (PUT)', () => {
      it('THEN it should return status 200 AND body with the defined structure ', async () => {
        const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([transaction]);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          coins: expect.arrayContaining([
            {
              amount: expect.any(Number),
              coin: expect.any(String),
              fullname: expect.any(String),
              transactions: expect.arrayContaining([
                {
                  currentCotation: expect.any(Number),
                  datetime: expect.any(String),
                  receiveFrom: expect.any(String),
                  sendTo: expect.any(String),
                  value: expect.any(Number)
                }
              ])
            }
          ])
        });
      });
    });

    describe('WHEN making a deposit to a nonexistent wallet / (PUT)', () => {
      it('THEN it should return status 404 AND body with not found error informing about the nonexistent address', async () => {
        const response = await request(app.getHttpServer()).put(`/wallet/${addressFactory}`).send([transaction]);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.any(String),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(404);
        expect(body.message).toEqual('Wallet not found for the searched address.');
        expect(body.error).toBe('Not Found');
      });
    });

    describe('WHEN making a deposit to a existing wallet / (PUT)', () => {
      describe('AND the used deposit coin already exists', () => {
        it('THEN it should return status 200 AND body with the used transaction coins with the new amount', async () => {
          const reqTrans = transactionFactory({ quoteTo: transactions[0].quoteTo });
          const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

          expect(response.status).toBe(200);

          const { coins } = response.body;

          expect(coins).toHaveLength(1);
          expect(coins[0].amount).toBeGreaterThan(iniAmounts[0]);
          expect(coins[0].coin).toBe(reqTrans.quoteTo);
          expect(coins[0].fullname).toEqual(expect.any(String));
          expect(coins[0].transactions).toHaveLength(2);
          expect(coins[0].transactions[1].value).toEqual(reqTrans.value);
          expect(coins[0].transactions[1].currentCotation).toEqual(expect.any(Number));
          expect(coins[0].transactions[1].datetime).toEqual(expect.any(String));
          expect(coins[0].transactions[1].sendTo).toEqual(address);
          expect(coins[0].transactions[1].receiveFrom).toEqual(address);
        });
      });

      describe('AND the used deposit coin is not registered / (PUT)', () => {
        it('THEN it should return status 200 AND body with the used transaction coins with the inserted amount', async () => {
          const reqTrans = transactionFactory({ quoteTo: 'GBP', currentCoin: 'BRL' });
          const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

          expect(response.status).toBe(200);

          const { coins } = response.body;

          expect(coins).toHaveLength(1);
          expect(coins[0].coin).toBe(reqTrans.quoteTo);
          expect(coins[0].fullname).toEqual(expect.any(String));
          expect(coins[0].transactions).toHaveLength(1);
          expect(coins[0].transactions[0].value).toEqual(reqTrans.value);
          expect(coins[0].transactions[0].currentCotation).toEqual(expect.any(Number));
          expect(coins[0].transactions[0].datetime).toEqual(expect.any(String));
          expect(coins[0].transactions[0].sendTo).toEqual(address);
          expect(coins[0].transactions[0].receiveFrom).toEqual(address);
        });
      });
    });

    describe('WHEN making a withdraw from a existing wallet / (PUT)', () => {
      describe('AND the used coin is not registered', () => {
        it('THEN it should return status 400 AND body with bad request error informing the mistake', async () => {
          const reqTrans = transactionFactory({ negative: true, quoteTo: 'CHF', currentCoin: 'EUR' });
          const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

          expect(response.status).toBe(400);

          expect(response.body).toEqual({
            statusCode: expect.any(Number),
            message: expect.any(String),
            error: expect.any(String)
          });
          const { body } = response;

          expect(body.statusCode).toBe(400);
          expect(body.message).toEqual(`Insufficient funds for ${reqTrans.quoteTo}.`);
          expect(body.error).toBe('Bad Request');
        });
      });

      describe('AND the used coin already exists', () => {
        describe('AND has enough balance', () => {
          it('THEN it should return status 200 AND body with the used transaction coins with the new amount', async () => {
            const reqTrans = transactionFactory({ quoteTo: transactions[2].quoteTo, negative: true });
            const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

            expect(response.status).toBe(200);

            const { coins } = response.body;

            expect(coins).toHaveLength(1);
            expect(coins[0].amount).toBeLessThan(iniAmounts[2]);
            expect(coins[0].coin).toBe(reqTrans.quoteTo);
            expect(coins[0].fullname).toEqual(expect.any(String));
            expect(coins[0].transactions).toHaveLength(2);
            expect(coins[0].transactions[1].value).toEqual(reqTrans.value);
            expect(coins[0].transactions[1].currentCotation).toEqual(expect.any(Number));
            expect(coins[0].transactions[1].datetime).toEqual(expect.any(String));
            expect(coins[0].transactions[1].sendTo).toEqual(address);
            expect(coins[0].transactions[1].receiveFrom).toEqual(address);
          });
        });
        describe('AND has not enough balance', () => {
          it('THEN it should return status 400 AND body informing that is not balance to accomplish the transaction', async () => {
            const reqTrans = transactionFactory({ quoteTo: 'GBP', currentCoin: 'BRL', negative: true });
            const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
              statusCode: expect.any(Number),
              message: expect.any(String),
              error: expect.any(String)
            });
            const { body } = response;

            expect(body.statusCode).toBe(400);
            expect(body.message).toEqual('Insufficient funds for GBP.');
            expect(body.error).toBe('Bad Request');
          });
        });
      });
    });

    describe('WHEN making a withdraw AND a deposit from a existing wallet / (PUT)', () => {
      describe('AND all the used coins already exists', () => {
        describe('AND has enough balance for withdraw', () => {
          it('THEN it should return status 200 AND body with the executed transactions', async () => {
            const reqWith = transactionFactory({ quoteTo: transactions[3].quoteTo, negative: true });
            const reqDep = transactionFactory({ quoteTo: transactions[1].quoteTo });
            const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqWith, reqDep]);

            expect(response.status).toBe(200);

            const { coins } = response.body;

            expect(coins).toHaveLength(2);
            expect(coins[0].amount).toBeLessThan(iniAmounts[3]);
            expect(coins[0].coin).toBe(reqWith.quoteTo);
            expect(coins[0].fullname).toEqual(expect.any(String));
            expect(coins[0].transactions).toHaveLength(2);
            expect(coins[0].transactions[1].value).toEqual(reqWith.value);
            expect(coins[0].transactions[1].currentCotation).toEqual(expect.any(Number));
            expect(coins[0].transactions[1].datetime).toEqual(expect.any(String));
            expect(coins[0].transactions[1].sendTo).toEqual(address);
            expect(coins[0].transactions[1].receiveFrom).toEqual(address);

            expect(coins[1].amount).toBeGreaterThan(iniAmounts[1]);
            expect(coins[1].coin).toBe(reqDep.quoteTo);
            expect(coins[1].fullname).toEqual(expect.any(String));
            expect(coins[1].transactions).toHaveLength(2);
            expect(coins[1].transactions[1].value).toEqual(reqDep.value);
            expect(coins[1].transactions[1].currentCotation).toEqual(expect.any(Number));
            expect(coins[1].transactions[1].datetime).toEqual(expect.any(String));
            expect(coins[1].transactions[1].sendTo).toEqual(address);
            expect(coins[1].transactions[1].receiveFrom).toEqual(address);
          });
        });

        describe('AND does not have enough balance for withdraw', () => {
          it('THEN it should return status 400 AND body with bad request error informing the missing balance', async () => {
            const reqDep = transactionFactory({ quoteTo: transactions[1].quoteTo });
            const reqWith = transactionFactory({ quoteTo: transactions[0].quoteTo, negative: true });
            reqWith.value *= 10000000;
            const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqDep, reqWith]);

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
              statusCode: expect.any(Number),
              message: expect.any(String),
              error: expect.any(String)
            });
            const { body } = response;

            expect(body.statusCode).toBe(400);
            expect(body.message).toEqual(`Insufficient funds for ${reqWith.quoteTo}.`);
            expect(body.error).toBe('Bad Request');
          });
        });
      });
      describe('AND one of the used coins does not exists', () => {
        describe('AND the nonexistent is trying to withdraw', () => {
          it('THEN it should return status 400 AND body with bad request error informing the mistake', async () => {
            const reqDep = transactionFactory({ quoteTo: transactions[1].quoteTo });
            const reqWith = transactionFactory({ negative: true, quoteTo: 'CHF', currentCoin: 'EUR' });
            const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqDep, reqWith]);

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
              statusCode: expect.any(Number),
              message: expect.any(String),
              error: expect.any(String)
            });
            const { body } = response;

            expect(body.statusCode).toBe(400);
            expect(body.message).toEqual(`Insufficient funds for ${reqWith.quoteTo}.`);
            expect(body.error).toBe('Bad Request');
          });
        });
      });
    });

    describe('WHEN making a request without informing one of the needed attributes / (PUT)', () => {
      it('THEN it should return status 400 AND body with bad request error informing the missing attributes', async () => {});
    });

    describe('WHEN making a request with a invalid attribute / (PUT)', () => {
      it('THEN it should return status 400 AND body with bad request error informing the wrong format of the attribute', async () => {
        const response = await request(app.getHttpServer())
          .put(`/wallet/${address}`)
          .send([{ quoteTo: 12 }]);

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.arrayContaining([expect.any(String)]),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toHaveLength(9);
        expect(body.message).toEqual([
          'quoteTo must be longer than or equal to 3 characters',
          'quoteTo must be shorter than or equal to 4 characters',
          'quoteTo must be a string',
          'currentCoin must be longer than or equal to 3 characters',
          'currentCoin must be shorter than or equal to 4 characters',
          'currentCoin must be a string',
          'currentCoin should not be empty',
          'value must be a number conforming to the specified constraints',
          'value should not be empty'
        ]);
        expect(body.error).toBe('Bad Request');
      });
    });

    describe('WHEN making a request with a invalid quoteTo coin/ (PUT)', () => {
      it('THEN it should return status 404 AND body with not found error informing that the used value was not found', async () => {
        const reqTrans = transactionFactory({ quoteTo: 'ABC' });
        const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([reqTrans]);

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.any(String),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(404);
        expect(body.message).toEqual(`Conversion from ${reqTrans.currentCoin} to ${reqTrans.quoteTo} not found.`);
        expect(body.error).toBe('Not Found');
      });
    });
  });
});
