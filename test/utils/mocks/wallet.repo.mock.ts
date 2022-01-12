import { v4 } from 'uuid';
import { manyWallets } from '../factory/wallet.factory';

export const UUaddress = v4();
export const GENERATED = manyWallets();
export const MOCKWALLETREPOSITORY = {
  insertWallet: jest.fn((dto) => ({
    address: v4(),
    ...dto,
    created_at: new Date(),
    updated_at: new Date()
  })),
  findOneWallet: jest.fn((cpf) => GENERATED.find((wallet) => wallet.cpf === cpf)),
  findByaddress: jest.fn((address) => ({
    ...GENERATED.find((wallet) => wallet.address === address)
  })),
  update: jest.fn((address, dto) => {
    const index = GENERATED.findIndex((wallet) => wallet.address === address);
    GENERATED[index] = {
      ...GENERATED[index],
      ...dto,
      updated_at: new Date()
    };
    return {
      affected: index === -1 ? 0 : 1,
      raw: GENERATED[index]
    };
  }),
  delete: jest.fn((address) => {
    const index = GENERATED.findIndex((wallet) => wallet.address === address);
    if (index === -1) {
      return {
        affected: 0
      };
    }
    const deleted = GENERATED.splice(index, 1);
    return {
      affected: deleted.length,
      raw: deleted.pop()
    };
  })
};
