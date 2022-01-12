import { getConnection } from 'typeorm';

export default async (): Promise<void> => {
  const entities = getConnection().entityMetadatas;

  const items = entities.map((entity) => {
    const repository = getConnection().getRepository(entity.tableName);
    return repository.clear();
  });
  await Promise.all(items);
};
