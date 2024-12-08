import { include as dynamoDbInclude } from '../drivers/dynamodb/include';
import { expectORMConfiguration } from '../utils/expectOrmConfiguration';

export const include = async <I, C>(
  classInstance: I,
  relationship: keyof I,
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
  cls: new (..._: any[]) => C,
) => {
  const { engine } = expectORMConfiguration();

  switch (engine) {
    case 'DYNAMODB':
      await dynamoDbInclude(classInstance, relationship, cls);
      break;
    default:
      throw new Error(
        `No \`include\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
      );
  }
};
