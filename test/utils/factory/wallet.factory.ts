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
  const cars = [];
  for (let i = 0; i < quantity; i += 1) {
    const address = v4();
    cars.push({
      ...oneWallet(),
      address,
      created_at: new Date(),
      updated_at: new Date(),
      coins: [coin(address, 3), coin(address, 7)]
    });
  }
  return cars;
};
