import Chance from 'chance';
import { include } from '../../src/actions/include';
import { expectORMConfiguration } from '../../src/utils/expectOrmConfiguration';

import type { ORMConfiguration } from '../../src/types/ormConfiguration';

jest.mock('../../src/utils/expectOrmConfiguration');
const expectORMConfigurationMocked = jest.mocked(expectORMConfiguration);

import { include as dynamoDbInclude } from '../../src/drivers/dynamodb/include';
jest.mock('../../src/drivers/dynamodb/include');
const dynamoDbIncludeMocked = jest.mocked(dynamoDbInclude);

describe('`include`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should forward the include to the DynamoDB driver if the configured database engine is `DYNAMODB`', async () => {
    const relationshipKey = chance.string();

    const classInstance = {
      [relationshipKey]: chance.string(),
    };

    const cls = class {
      a: string = chance.string();
    };

    expectORMConfigurationMocked.mockReturnValue({
      engine: 'DYNAMODB',
    });

    await include(classInstance, relationshipKey, cls);

    expect(dynamoDbIncludeMocked).toHaveBeenCalledWith(
      classInstance,
      relationshipKey,
      cls,
    );
  });

  it('should throw an error if no driver is found for the configured engine', () => {
    const classInstance = {
      a: 'b',
    };

    const engine = chance.string();

    expectORMConfigurationMocked.mockReturnValue({
      engine,
    } as unknown as ORMConfiguration);

    expect(() => include(classInstance, 'a', class {})).rejects.toThrow(
      `No \`include\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
    );
  });
});
