import { getConnection } from 'typeorm';

export default async (): Promise<void> => {
  const repository = getConnection().getRepository('wallet');
  await repository.query('TRUNCATE wallet CASCADE;');
};
