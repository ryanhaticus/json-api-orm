import Chance from 'chance';
import { put } from '../../../src/actions/put';
import { expectORMConfiguration } from '../../../src/utils/expectOrmConfiguration';

import type { ORMConfiguration } from '../../../src/types/ormConfiguration';

jest.mock('../../../src/utils/expectOrmConfiguration');
const expectORMConfigurationMocked = jest.mocked(expectORMConfiguration);

import { put as dynamoDbPut } from '../../../src/drivers/dynamodb/put';
jest.mock('../../../src/drivers/dynamodb/put');
const dynamoDbPutMocked = jest.mocked(dynamoDbPut);

describe('`put`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should forward the put to the DynamoDB driver if the configured database engine is `DYNAMODB`', async () => {
    const cls = class {
      a: string = chance.string();
    }

    expectORMConfigurationMocked.mockReturnValue({
      engine: 'DYNAMODB'
    });

    await put(cls);

    expect(dynamoDbPutMocked).toHaveBeenCalledWith(cls);
  });

  it('should throw an error if no driver is found for the configured engine', () => {
    const engine = chance.string();

    expectORMConfigurationMocked.mockReturnValue({
      engine,
    } as unknown as ORMConfiguration);

    expect(() => put(class {})).rejects.toThrow(
      `No \`put\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
    )
  });
});