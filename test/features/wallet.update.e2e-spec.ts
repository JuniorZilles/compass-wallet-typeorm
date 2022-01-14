import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import AppModule from '../../src/app.module';
import cleanDatabase from '../utils/clean-database';
import { oneWallet } from '../utils/factory/wallet.factory';
import transactionFactory from '../utils/factory/transaction.factory';

describe('scr :: api :: wallet :: WalletController() :: update (e2e)', () => {
  describe('GIVEN a existing wallet', () => {
    let app: INestApplication;
    const walletFactory = oneWallet();
    let address: string;
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

      const response = await request(app.getHttpServer()).post('/wallet').send(walletFactory);
      expect(response.status).toBe(201);
      address = response.body.address;
    });

    afterAll(async () => {
      await cleanDatabase();
      await app.close();
    });

    describe('WHEN requested to make a deposit to a wallet / (PUT)', () => {
      it('THEN it should return status 200 with the defined structure ', async () => {
        const response = await request(app.getHttpServer()).put(`/wallet/${address}`).send([transactionFactory()]);
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

    describe('WHEN creating a new wallet with missing attributes / (PUT)', () => {
      it('THEN it should return a bad request for missing birthdate', async () => {});
    });
  });
});
