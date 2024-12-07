import { getMetadataBySymbol, resourceSymbol } from '@tsmetadata/json-api';
import { get as dynamoDbGet } from '../drivers/dynamodb/get';
import { expectORMConfiguration } from '../utils/expectORMConfiguration';

// biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
export const get = async <C>(cls: new (..._: any[]) => C, id: string) => {
  const { engine } = expectORMConfiguration();

  const type = getMetadataBySymbol<string>(cls.prototype, resourceSymbol);

  if (type === undefined) {
    throw new Error(`Unable to get resource because no resource type was found on the provided class prototype.
Did you forget to add the @Resource(type: string) decorator to the class?`);
  }

  switch (engine) {
    case 'DYNAMODB':
      dynamoDbGet(cls, id, type);
      break;
  }

  throw new Error(
    `No \`get\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
  );
};
