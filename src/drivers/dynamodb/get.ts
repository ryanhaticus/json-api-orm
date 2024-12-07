import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import {
  type JSONAPIResourceObject,
  deserializeResourceObject,
} from '@tsmetadata/json-api';
import { unflatten } from 'flat';

export const get = async <C>(
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
  cls: new (..._: any[]) => C,
  id: string,
  type: string,
) => {
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
