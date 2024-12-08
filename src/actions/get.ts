import { get as dynamoDbGet } from '../drivers/dynamodb/get';
import { expectORMConfiguration } from '../utils/expectOrmConfiguration';

// biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
export const get = async <C>(cls: new (..._: any[]) => C, id: string) => {
  const { engine } = expectORMConfiguration();

  switch (engine) {
    case 'DYNAMODB':
      return dynamoDbGet(cls, id);
    default:
      throw new Error(
        `No \`get\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
      );
  }
};
