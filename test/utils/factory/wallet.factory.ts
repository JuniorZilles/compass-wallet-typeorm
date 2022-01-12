import * as Chance from 'chance';
import { v4 } from 'uuid';

export const oneWallet = () => {
  const chance = new Chance();
  return {
    name: chance.name(),
    birthdate: chance.birthday(),
    cpf: chance.cpf()
  };
};

export const manyWallets = (quantity = 10) => {
  const cars = [];
  for (let i = 0; i < quantity; i += 1) {
    cars.push({ ...oneWallet(), id: v4(), created_at: new Date(), updated_at: new Date() });
  }
  return cars;
};
