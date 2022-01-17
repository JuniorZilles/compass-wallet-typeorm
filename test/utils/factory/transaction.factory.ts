import * as Chance from 'chance';
import { FROM_CURRENCY, TO_CURRENCY } from './currency.factory';

export default ({
  quoteTo,
  currentCoin,
  negative = false
}: {
  quoteTo?: string;
  currentCoin?: string;
  negative?: boolean;
}) => {
  const chance = new Chance();
  let index = quoteTo ? TO_CURRENCY.indexOf(quoteTo) : chance.integer({ min: 0, max: TO_CURRENCY.length - 1 });

  if (index === -1) {
    index = chance.integer({ min: 0, max: TO_CURRENCY.length - 1 });
  }
  return {
    quoteTo: quoteTo ?? TO_CURRENCY[index],

    currentCoin: currentCoin ?? FROM_CURRENCY[index],

    value: chance.floating(negative ? { min: -5, max: -1, fixed: 2 } : { min: 2000, max: 60000, fixed: 2 }) * 0.9
  };
};
