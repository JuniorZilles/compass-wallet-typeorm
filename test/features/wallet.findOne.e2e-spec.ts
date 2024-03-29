import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import transactionFactory from '../utils/factory/transaction.factory';
import addressFactory from '../utils/factory/address.factory';
import AppModule from '../../src/app.module';
import { createOneWallet } from '../utils/factory/wallet.factory';

describe('scr :: api :: wallet :: WalletController() :: findOne (e2e)', () => {
  describe('GIVEN existing register', () => {
    let app: INestApplication;
    let address: string;
    const walletFactory = createOneWallet();
    const addressFake = addressFactory;
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
      const responsePut = await request(app.getHttpServer())
        .put(`/wallet/${address}`)
        .send([transactionFactory({}), transactionFactory({})]);
      expect(responsePut.status).toBe(200);
    });

    afterAll(async () => {
      await app.close();
    });

    describe('WHEN searching a valid new wallet / (GET)', () => {
      it('THEN it should return a new wallet', async () => {
        const response = await request(app.getHttpServer()).get(`/wallet/${address}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
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
        });
        const { body } = response;

        expect(body.cpf).toBe(walletFactory.cpf);
        expect(body.birthdate).toBe(walletFactory.birthdate);
        expect(body.name).toBe(walletFactory.name);
      });
    });

    describe('WHEN searching for a non existing wallet / (GET)', () => {
      it('THEN it should return a Not Found when does not exist register', async () => {
        const response = await request(app.getHttpServer()).get(`/wallet/${addressFake}`);
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

    describe('WHEN searching whit invalid uuid / (GET)', () => {
      it('THEN it should return a bad request for invalid uuid', async () => {
        const response = await request(app.getHttpServer()).get('/wallet/123456');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.any(String),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual('Validation failed (uuid  is expected)');
        expect(body.error).toBe('Bad Request');
      });
    });
  });
});
