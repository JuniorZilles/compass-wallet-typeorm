import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import addressFactory from '../utils/factory/address.factory';
import AppModule from '../../src/app.module';
import { oneWallet } from '../utils/factory/wallet.factory';

describe('scr :: api :: wallet :: WalletController() :: remove (e2e)', () => {
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

      const response = await request(app.getHttpServer()).post('/wallet').send(walletFactory);
      expect(response.status).toBe(201);
      address = response.body.address;
    });

    afterAll(async () => {
      await app.close();
    });

    describe('WHEN removing a existing / (DELETE)', () => {
      it('THEN it should return 204 with no content', async () => {
        const response = await request(app.getHttpServer()).delete(`/wallet/${address}`);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
    });

    describe('WHEN removing a non existing wallet / (DELETE)', () => {
      it('THEN it should return a Not Found when does not exist register', async () => {
        const response = await request(app.getHttpServer()).delete(`/wallet/${addressFake}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.any(String),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(404);
        expect(body.message).toEqual('Wallet not found for the used address.');
        expect(body.error).toBe('Not Found');
      });
    });

    describe('WHEN removing whit invalid uuid / (DELETE)', () => {
      it('THEN it should return a bad request for invalid uuid', async () => {
        const response = await request(app.getHttpServer()).delete('/wallet/123456');
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
