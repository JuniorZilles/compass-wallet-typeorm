import Transaction from 'src/wallet/transaction/entities/transaction.entity';
import { v4 } from 'uuid';
import { manyWallets } from '../factory/wallet.factory';

let GENERATED = manyWallets();

export const renewWallet = () => {
  GENERATED = manyWallets();
};

export const getGenerated = (pos: number) => {
  pos = pos > 10 ? 10 : pos;
  pos = pos < 0 ? 0 : pos;
  return GENERATED[pos];
};

export const MOCKWALLETREPOSITORY = {
  insertWallet: jest.fn((dto) => ({
    address: v4(),
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  findOneWallet: jest.fn(({ cpf, address, name, birthdate }) =>
    GENERATED.find(
      (wallet) =>
        wallet.cpf === cpf || wallet.address === address || wallet.name === name || wallet.birthdate === birthdate
    )
  ),
  update: jest.fn((address, dto) => {
    const index = GENERATED.findIndex((wallet) => wallet.address === address);
    GENERATED[index] = {
      ...GENERATED[index],
      ...dto,
      updatedAt: new Date()
    };
    return {
      affected: index === -1 ? 0 : 1,
      raw: GENERATED[index]
    };
  }),
  remove: jest.fn((search) => {
    const index = GENERATED.findIndex((wallet) => wallet.address === search.address);
    if (index === -1) {
      return null;
    }
    const deleted = GENERATED.splice(index, 1);
    return deleted.pop();
  }),
  findAll: jest.fn((payload) => {
    const { page = 1, limit = 10, order, ...search } = payload;
    const queryBuilder = GENERATED.filter((wallet) => {
      if (search.coin) {
        if (wallet.coins.find((coin) => coin.coin === search.coin)) {
          return true;
        }
      }
      if (search.name) {
        if (wallet.name === search.name) {
          return true;
        }
      }
      if (search.name || search.coin) {
        return false;
      }
      return true;
    });
    const { length } = queryBuilder;
    const pages = Math.abs(length / limit);
    const meta = {
      itemCount: limit > length ? length : limit,
      currentPage: page,
      totalPages: pages,
      itemsPerPage: limit,
      totalItems: length
    };
    if (queryBuilder.length > limit) {
      const filtered = queryBuilder.slice((page - 1) * limit, page * limit);
      return {
        items: filtered,
        meta
      };
    }
    return {
      items: queryBuilder,
      meta
    };
  })
};

export const MOCKCOINREPOSITORY = {
  findCoin: jest.fn((coin, wallet) => {
    const index = GENERATED.findIndex((reg) => reg.address === wallet.address);
    if (index === -1) {
      return null;
    }
    const indexCoin = GENERATED[index].coins.findIndex((reg) => reg.coin === coin);
    if (indexCoin === -1) {
      return null;
    }
    return GENERATED[index].coins[indexCoin];
  }),
  create: jest.fn(({ coin, amount, wallet, fullname, transactions }) => ({
    id: v4(),
    wallet: wallet.address,
    transactions: transactions.map((transaction: Transaction) => ({
      ...transaction,
      receiveFrom: transaction.receiveFrom.address,
      sendTo: transaction.sendTo.address,
      datetime: new Date(),
      id: v4()
    })),
    coin,
    fullname,
    amount
  })),
  save: jest.fn((dto) => dto)
};

export const MOCKTRANSACTIONREPOSITORY = {
  create: jest.fn((dto) => ({
    ...dto,
    receiveFrom: dto.receiveFrom.address,
    sendTo: dto.sendTo.address,
    datetime: new Date(),
    id: v4()
  }))
};
