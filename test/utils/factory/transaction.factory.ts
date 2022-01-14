import * as Chance from 'chance';

export default () => {
  const chance = new Chance();

  return {
    quoteTo: chance.coin(),

    currentCoin: chance.coin(),

    value: chance.floating({ min: 0, max: 100, fixed: 2 })
  };
};
