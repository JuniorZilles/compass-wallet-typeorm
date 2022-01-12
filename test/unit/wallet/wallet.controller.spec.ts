import { Test, TestingModule } from '@nestjs/testing';
import { MOCKWALLETREPOSITORY } from '../../utils/mocks/wallet.repo.mock';
import WalletRepository from '../../../src/wallet/wallet.repository';
import WalletController from '../../../src/wallet/wallet.controller';
import WalletService from '../../../src/wallet/wallet.service';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [WalletRepository, WalletService]
    })
      .overrideProvider(WalletRepository)
      .useValue(MOCKWALLETREPOSITORY)
      .compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('THEN the WalletController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('THEN the WalletController should have a findAll method', () => {
    expect(controller).toHaveProperty('findAll');
  });

  it('THEN the WalletController should have a findOne method', () => {
    expect(controller).toHaveProperty('findOne');
  });

  it('THEN the WalletController should have a create method', () => {
    expect(controller).toHaveProperty('create');
  });

  it('THEN the WalletController should have a update method', () => {
    expect(controller).toHaveProperty('update');
  });

  it('THEN the WalletController should have a remove method', () => {
    expect(controller).toHaveProperty('remove');
  });
});
