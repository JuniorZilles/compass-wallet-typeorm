import * as Chance from 'chance';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { TO_CURRENCY } from './currency.factory';

export const oneWallet = () => {
  const chance = new Chance();
  const year = chance.year({ min: 1970, max: 2004 });
  return {
    name: chance.name(),
    birthdate: moment(chance.birthday({ year })).format('DD/MM/YYYY'),
    cpf: chance.cpf()
  };
};

const coin = (address: string, pos: number) => {
  const chance = new Chance();
  return {
    coin: TO_CURRENCY[pos],
    fullname: chance.currency().name,
    amount: chance.floating({ min: 0, max: 100, fixed: 2 }),
    transactions: [
      {
        value: chance.floating({ min: 0, max: 100, fixed: 2 }),
        datetime: chance.date(),
        sendTo: address,
        receiveFrom: address,
        currentCotation: chance.floating({ min: 0, max: 100, fixed: 2 })
      }
    ]
  };
};

export const manyWallets = (quantity = 10) => {
  const wallets = [];
  const chance = new Chance();
  for (let i = 0; i < quantity; i += 1) {
    const pos1 = chance.integer({ min: 0, max: TO_CURRENCY.length - 1 });
    let pos2 = chance.integer({ min: 0, max: TO_CURRENCY.length - 1 });
    if (pos1 === pos2) {
      pos2 = chance.integer({ min: 0, max: TO_CURRENCY.length - 1 });
    }
    const address = v4();
    wallets.push({
      ...oneWallet(),
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
      coins: [coin(address, pos1), coin(address, pos2)]
    });
  }
  return wallets;
};
