import * as Chance from 'chance';
import * as moment from 'moment';
import { v4 } from 'uuid';

export const oneWallet = () => {
  const chance = new Chance();
  return {
    name: chance.name(),
    birthdate: moment(chance.birthday()).format('DD/MM/YYYY'),
    cpf: chance.cpf()
  };
};

export const manyWallets = (quantity = 10) => {
  const cars = [];
  for (let i = 0; i < quantity; i += 1) {
    cars.push({ ...oneWallet(), address: v4(), created_at: new Date(), updated_at: new Date() });
  }
  return cars;
};
