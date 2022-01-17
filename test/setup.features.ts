import cleanDatabase from './utils/clean-database';

global.afterEach(async () => {
  await cleanDatabase();
});
