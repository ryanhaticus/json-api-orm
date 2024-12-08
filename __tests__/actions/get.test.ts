import { Chance } from "chance";
import { get } from "../../src/actions/get";
import { expectORMConfiguration } from "../../src/utils/expectOrmConfiguration";

import type { ORMConfiguration } from "../../src/types/ormConfiguration";

jest.mock('../../src/utils/expectOrmConfiguration');
const expectORMConfigurationMocked = jest.mocked(expectORMConfiguration);

import { get as dynamoDbGet } from '../../src/drivers/dynamodb/get';
jest.mock('../../src/drivers/dynamodb/get');
const dynamoDbGetMocked = jest.mocked(dynamoDbGet);

describe('`get`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should forward the get to the DynamoDB driver if the configured database engine is `DYNAMODB`', async () => {
    const cls = class {
      a: string = chance.string();
    }
    const id = chance.string();

    expectORMConfigurationMocked.mockReturnValue({
      engine: 'DYNAMODB'
    });

    const expectedResult = chance.string();

    dynamoDbGetMocked.mockResolvedValue(expectedResult);

    const result = await get(cls, id);

    expect(dynamoDbGetMocked).toHaveBeenCalledWith(cls, id);
    expect(result).toBe(expectedResult);
  });

  it('should throw an error if no driver is found for the configured engine', () => {
    const engine = chance.string();

    expectORMConfigurationMocked.mockReturnValue({
      engine,
    } as unknown as ORMConfiguration);

    expect(() => get(class {}, 'blahblah')).rejects.toThrow(
      `No \`get\` driver found for database engine \`${engine}\`, please check your JSON:API ORM configuration.`,
    )
  });
});