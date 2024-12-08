import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import {
  type JSONAPIResourceObject,
  deserializeResourceObject,
  getMetadataBySymbol,
  resourceSymbol,
} from '@tsmetadata/json-api';
import { unflatten } from 'flat';

export const get = async <C>(
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
  cls: new (..._: any[]) => C,
  id: string,
) => {
  const type = getMetadataBySymbol<string>(cls.prototype, resourceSymbol);

  if (type === undefined) {
    throw new Error(`Unable to get resource because no resource type was found on the provided class prototype.
Did you forget to add the @Resource(type: string) decorator to the class?`);
  }

  const getItemCommand = new GetItemCommand({
    TableName: type,
    Key: {
      id: { S: id },
    },
  });

  const dynamoDbClient = new DynamoDBClient();

  const { Item } = await dynamoDbClient.send(getItemCommand);

  if (Item === undefined) {
    return undefined;
  }

  const unmarshalledItem = unmarshall(Item);

  const unflattenedItem = unflatten(unmarshalledItem);

  const deserializedItem = deserializeResourceObject<C>(
    unflattenedItem as unknown as JSONAPIResourceObject,
    cls,
  );

  return deserializedItem;
};
