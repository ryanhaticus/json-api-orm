import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import {
  deserializeResourceObject,
  getMetadataBySymbol,
} from '@tsmetadata/json-api';
import { mockClient } from 'aws-sdk-client-mock';
import { Chance } from 'chance';
import { get } from '../../../src/drivers/dynamodb/get';

const dynamoDBClientMocked = mockClient(DynamoDBClient);

jest.mock('@tsmetadata/json-api');
const getMetadataBySymbolMocked = jest.mocked(getMetadataBySymbol);
const deserializeResourceObjectMocked = jest.mocked(deserializeResourceObject);

describe('DynamoDB `get`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should throw an error if no resource type was found on the provided class prototype', async () => {
    class cls {}

    getMetadataBySymbolMocked.mockReturnValue(undefined);

    await expect(get(cls, chance.string())).rejects.toThrow(
      `Unable to get resource because no resource type was found on the provided class prototype.
Did you forget to add the @Resource(type: string) decorator to the class?`,
    );
  });

  it('should get the unmarshalled, unflattened, and deserialized item from DynamoDB table', async () => {
    class cls {
      a = chance.string();
    }

    const id = chance.string();

    const type = chance.string();

    getMetadataBySymbolMocked.mockReturnValue(type);

    const Item = {
      a: { S: chance.string() },
    };

    dynamoDBClientMocked.on(GetItemCommand).resolves({
      Item,
    });

    deserializeResourceObjectMocked.mockReturnValue(Item.a.S);

    const result = await get(cls, id);

    expect(deserializeResourceObjectMocked).toHaveBeenCalledWith(
      {
        a: Item.a.S,
      },
      cls,
    );

    expect(result).toEqual(Item.a.S);
  });

  it('should return `undefined` if the item is not found in the DynamoDB table', async () => {
    class cls {
      a = chance.string();
    }

    const id = chance.string();

    const type = chance.string();

    getMetadataBySymbolMocked.mockReturnValue(type);

    dynamoDBClientMocked.on(GetItemCommand).resolves({
      Item: undefined,
    });

    const result = await get(cls, id);

    expect(result).toBeUndefined();
  });
});
