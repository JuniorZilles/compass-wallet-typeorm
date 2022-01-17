import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import AppModule from '../../src/app.module';
import { oneWallet } from '../utils/factory/wallet.factory';

describe('scr :: api :: wallet :: WalletController() :: create (e2e)', () => {
  describe('GIVEN a empty database', () => {
    let app: INestApplication;
    const walletFactory = oneWallet();
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

    afterAll(async () => {
      await app.close();
    });

    describe('WHEN creating a valid new wallet / (POST)', () => {
      it('THEN it should return a new wallet', async () => {
        const response = await request(app.getHttpServer()).post('/wallet').send(walletFactory);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          address: expect.any(String),
          birthdate: expect.any(String),
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

    describe('WHEN creating a new wallet with missing attributes / (POST)', () => {
      it('THEN it should return a bad request for missing birthdate', async () => {
        const { name, cpf } = walletFactory;
        const response = await request(app.getHttpServer()).post('/wallet').send({ name, cpf });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.arrayContaining([expect.any(String)]),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual([
          'The informed date is invalid, it should have the format of dd/mm/yyyy and be greater than 18 years from now',
          'birthdate should not be empty'
        ]);
        expect(body.error).toBe('Bad Request');
      });

      it('THEN it should return a bad request for missing cpf', async () => {
        const { name, birthdate } = walletFactory;
        const response = await request(app.getHttpServer()).post('/wallet').send({ name, birthdate });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.arrayContaining([expect.any(String)]),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual([
          'The CPF is invalid, it should have the format of xxx.xxx.xxx-xx.',
          'cpf should not be empty'
        ]);
        expect(body.error).toBe('Bad Request');
      });
    });

    describe('WHEN creating a new wallet with invalid attributes / (POST)', () => {
      it('THEN it should return a bad request for invalid birthdate', async () => {
        const { name, cpf } = walletFactory;
        const response = await request(app.getHttpServer())
          .post('/wallet')
          .send({ name, cpf, birthdate: '13/11/2020' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.arrayContaining([expect.any(String)]),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual([
          'The informed date is invalid, it should have the format of dd/mm/yyyy and be greater than 18 years from now'
        ]);
        expect(body.error).toBe('Bad Request');
      });

      it('THEN it should return a bad request for invalid cpf', async () => {
        const { name, birthdate } = walletFactory;
        const response = await request(app.getHttpServer())
          .post('/wallet')
          .send({ name, cpf: '123.456.789-10', birthdate });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: expect.any(Number),
          message: expect.arrayContaining([expect.any(String)]),
          error: expect.any(String)
        });
        const { body } = response;

        expect(body.statusCode).toBe(400);
        expect(body.message).toEqual(['The CPF is invalid, it should have the format of xxx.xxx.xxx-xx.']);
        expect(body.error).toBe('Bad Request');
      });
    });
  });
});
