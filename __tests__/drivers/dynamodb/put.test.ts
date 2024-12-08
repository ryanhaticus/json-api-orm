import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { serializeResourceObject } from '@tsmetadata/json-api';
import { mockClient } from 'aws-sdk-client-mock';
import { Chance } from 'chance';
import { put } from '../../../src/drivers/dynamodb/put';

const dynamoDBClientMocked = mockClient(DynamoDBClient);

jest.mock('@tsmetadata/json-api');
const serializeResourceObjectMocked = jest.mocked(serializeResourceObject);

describe('DynamoDB `put`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should put the serialized, flattened, and marshalled item to the DynamoDB table', async () => {
    const classInstance = {
      a: chance.string(),
    };

    const serializedResourceObject = {
      id: chance.string(),
      type: chance.string(),
      attributes: classInstance,
    };

    serializeResourceObjectMocked.mockReturnValue(serializedResourceObject);

    await put(classInstance);

    expect(serializeResourceObjectMocked).toHaveBeenCalledWith(classInstance);

    expect(dynamoDBClientMocked.call(0).args[0].input).toEqual({
      TableName: serializedResourceObject.type,
      Item: {
        id: { S: serializedResourceObject.id },
        type: { S: serializedResourceObject.type },
        'attributes.a': { S: classInstance.a },
      },
    });
  });
});
