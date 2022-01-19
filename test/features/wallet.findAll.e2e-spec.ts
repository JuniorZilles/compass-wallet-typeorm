import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import transactionFactory from '../utils/factory/transaction.factory';
import AppModule from '../../src/app.module';
import { createManyWallets, createOneWallet } from '../utils/factory/wallet.factory';

describe('scr :: api :: wallet :: WalletController() :: findAll (e2e)', () => {
  describe('GIVEN existing register', () => {
    let app: INestApplication;
    let walletFactory = createOneWallet();
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
      const wallets = createManyWallets(10);
      walletFactory = { ...wallets[0] };
      const walletsResponse = await Promise.all(
        wallets.map((wallet) => request(app.getHttpServer()).post('/wallet').send(wallet))
      );
      const transactionResponse = await Promise.all(
        walletsResponse.map(async (response) => {
          expect(response.status).toBe(201);
          const { address } = response.body;
          return request(app.getHttpServer())
            .put(`/wallet/${address}`)
            .send([transactionFactory({ quoteTo: 'EUR' }), transactionFactory({})]);
        })
      );
      transactionResponse.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    afterAll(async () => {
      await app.close();
    });

    describe('WHEN searching for all the content / (GET)', () => {
      it('THEN it should return status 200 AND with 10 wallets', async () => {
        const response = await request(app.getHttpServer()).get(`/wallet`);
        expect(response.status).toBe(200);
        const { body } = response;
        expect(body).toEqual({
          wallet: expect.arrayContaining([
            {
              address: expect.any(String),
              birthdate: expect.any(String),
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
              ]),
              cpf: expect.any(String),
              createdAt: expect.any(String),
              name: expect.any(String),
              updatedAt: expect.any(String)
            }
          ]),
          meta: expect.objectContaining({
            currentPage: expect.any(Number),
            itemCount: expect.any(Number),
            itemsPerPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number)
          })
        });
        expect(body.wallet).toHaveLength(10);
        expect(body.meta.currentPage).toEqual(1);
        expect(body.meta.totalPages).toEqual(1);
        expect(body.meta.itemCount).toEqual(10);
        expect(body.meta.itemsPerPage).toEqual(10);
        expect(body.meta.totalItems).toEqual(10);
      });
    });

    describe('WHEN searching for with a date / (GET)', () => {
      it('THEN it should return status 200 AND with the wallet on the body', async () => {
        const response = await request(app.getHttpServer()).get(`/wallet?birthdate=${walletFactory.birthdate}`);
        expect(response.status).toBe(200);
        const { body } = response;
        expect(body.wallet).toHaveLength(1);
        expect(body.wallet[0].birthdate).toBe(walletFactory.birthdate);
        expect(body.meta.currentPage).toEqual(1);
        expect(body.meta.totalPages).toEqual(1);
        expect(body.meta.itemCount).toEqual(1);
        expect(body.meta.itemsPerPage).toEqual(10);
        expect(body.meta.totalItems).toEqual(1);
      });
    });

    // describe('WHEN searching a wallet by its coin / (GET)', () => {
    //   it('THEN it should return status 200 AND with the wallet on the body', async () => {
    //     const response = await request(app.getHttpServer()).get(`/wallet?coin=EUR`);
    //     const { body } = response;

    //     expect(response.status).toBe(200);
    //     expect(body.wallet).toHaveLength(10);
    //     expect(body.wallet[0].coins[0].coin).toBe('EUR');
    //     expect(body.meta.currentPage).toEqual(1);
    //     expect(body.meta.totalPages).toEqual(1);
    //     expect(body.meta.itemCount).toEqual(10);
    //     expect(body.meta.itemsPerPage).toEqual(10);
    //     expect(body.meta.totalItems).toEqual(10);
    //   });
    // });

    // describe('WHEN searching for a invalid coin / (GET)', () => {
    //   it('THEN it should return status 200 AND no wallets will be returned', async () => {
    //     const response = await request(app.getHttpServer()).get(`/wallet?coin=ABC`);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toEqual({
    //       wallet: expect.any(Array),
    //       meta: expect.objectContaining({
    //         currentPage: expect.any(Number),
    //         itemCount: expect.any(Number),
    //         itemsPerPage: expect.any(Number),
    //         totalItems: expect.any(Number),
    //         totalPages: expect.any(Number)
    //       })
    //     });
    //     expect(response.body.wallet).toEqual([]);
    //     expect(response.body.meta.totalItems).toBe(0);
    //   });
    // });

    describe('WHEN searching a wallet with pagination / (GET)', () => {
      it('THEN it should return status 200 AND with the wallet on the body AND the pagination info', async () => {
        const response = await request(app.getHttpServer()).get(`/wallet?limit=2&page=2`);

        expect(response.status).toBe(200);
        const { body } = response;
        expect(body.wallet).toHaveLength(2);
        expect(body.meta.currentPage).toEqual(2);
        expect(body.meta.totalPages).toEqual(5);
        expect(body.meta.itemCount).toEqual(2);
        expect(body.meta.itemsPerPage).toEqual(2);
        expect(body.meta.totalItems).toEqual(10);
      });
    });
  });
});
