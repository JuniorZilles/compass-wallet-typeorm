import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import transactionFactory from '../utils/factory/transaction.factory';
import addressFactory from '../utils/factory/address.factory';
import AppModule from '../../src/app.module';
import { oneWallet } from '../utils/factory/wallet.factory';

describe('scr :: api :: wallet :: WalletController() :: findAll (e2e)', () => {
  describe('GIVEN existing register', () => {
    let app: INestApplication;
    let address: string;
    const walletFactory = oneWallet();
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

    describe('WHEN searching for a invalid coin / (GET)', () => {
      it('THEN it should return status 400 AND inform on the body that the used coin is invalid', async () => {});
    });

    describe('WHEN searching for with a date / (GET)', () => {
      it('THEN it should return status 200 AND with the wallet on the body', async () => {});
    });

    describe('WHEN searching a wallet by its amount / (GET)', () => {
      it('THEN it should return status 200 AND with the wallet on the body', async () => {});
    });

    describe('WHEN searching a wallet with pagination / (GET)', () => {
      it('THEN it should return status 200 AND with the wallet on the body AND the pagination info', async () => {});
    });
  });
});
