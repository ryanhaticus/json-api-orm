import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { serializeResourceObject } from '@tsmetadata/json-api';
import { flatten } from 'flat';

export const put = async (classInstance: object) => {
  const serializedResourceObject = serializeResourceObject(classInstance);

  const flattenedResourceObject = flatten(serializedResourceObject);

  const marshalledResourceObject = marshall(flattenedResourceObject);

  const putItemCommand = new PutItemCommand({
    TableName: serializedResourceObject.type,
    Item: marshalledResourceObject,
  });

  const dynamoDbClient = new DynamoDBClient();

  await dynamoDbClient.send(putItemCommand);
};
