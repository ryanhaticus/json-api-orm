import { isResourceLinkage } from '@tsmetadata/json-api';
import { Chance } from 'chance';
import { get } from '../../../src/drivers/dynamodb/get';
import { include } from '../../../src/drivers/dynamodb/include';

jest.mock('../../../src/drivers/dynamodb/get');
const getMocked = jest.mocked(get);

jest.mock('@tsmetadata/json-api');
const isResourceLinkageMocked = jest.mocked(isResourceLinkage);

describe('DynamoDB `include`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  describe('when the `resourceLinkageCandidate` is an array of resource identifier objects', () => {
    it('should get the resources from the DynamoDB table and include them in the relationship', async () => {
      const relationshipKey = chance.string();

      const classInstance = {
        [relationshipKey]: [
          {
            id: chance.string(),
            type: chance.string(),
          },
          {
            id: chance.string(),
            type: chance.string(),
          },
        ],
      };

      const cls = class {
        a: string = chance.string();
      };

      isResourceLinkageMocked.mockReturnValue(true);

      const resources = [
        {
          id: chance.string(),
          type: chance.string(),
          attributes: {
            a: chance.string(),
          },
        },
        {
          id: chance.string(),
          type: chance.string(),
          attributes: {
            a: chance.string(),
          },
        },
      ];

      getMocked.mockResolvedValueOnce(resources[0]);
      getMocked.mockResolvedValueOnce(resources[1]);

      const resultantClassInstance = { ...classInstance };

      await include(resultantClassInstance, relationshipKey, cls);

      expect(getMocked).toHaveBeenCalledTimes(2);
      expect(getMocked).toHaveBeenNthCalledWith(
        1,
        cls,
        classInstance[relationshipKey][0].id,
      );
      expect(getMocked).toHaveBeenNthCalledWith(
        2,
        cls,
        classInstance[relationshipKey][1].id,
      );

      expect(resultantClassInstance[relationshipKey]).toEqual(resources);
    });
  });

  describe('when the `resourceLinkageCandidate` is a resource identifier object', () => {
    it('should get the resource from the DynamoDB table and include it in the relationship', async () => {
      const relationshipKey = chance.string();

      const classInstance = {
        [relationshipKey]: {
          id: chance.string(),
          type: chance.string(),
        },
      };

      const cls = class {
        a: string = chance.string();
      };

      isResourceLinkageMocked.mockReturnValue(true);

      const resource = {
        id: chance.string(),
        type: chance.string(),
        attributes: {
          a: chance.string(),
        },
      };

      getMocked.mockResolvedValueOnce(resource);

      const resultantClassInstance = { ...classInstance };

      await include(resultantClassInstance, relationshipKey, cls);

      expect(getMocked).toHaveBeenCalledTimes(1);
      expect(getMocked).toHaveBeenCalledWith(
        cls,
        classInstance[relationshipKey].id,
      );

      expect(resultantClassInstance[relationshipKey]).toEqual(resource);
    });
  });

  describe('when the `resourceLinkageCandidate` is not a resource linkage', () => {
    it('should not include the relationship (no-op)', async () => {
      const relationshipKey = chance.string();

      const classInstance = {
        [relationshipKey]: chance.string(),
      };

      const cls = class {
        a: string = chance.string();
      };

      isResourceLinkageMocked.mockReturnValue(false);

      const resultantClassInstance = { ...classInstance };

      await include(resultantClassInstance, relationshipKey, cls);

      expect(resultantClassInstance).toEqual(classInstance);
    });
  });

  describe('when the `resourceLinkageCandidate` is `null`', () => {
    it('should not include the relationship (no-op)', async () => {
      const relationshipKey = chance.string();

      const classInstance = {
        [relationshipKey]: null,
      };

      const cls = class {
        a: string = chance.string();
      };

      isResourceLinkageMocked.mockReturnValue(true);

      const resultantClassInstance = { ...classInstance };

      await include(resultantClassInstance, relationshipKey, cls);

      expect(resultantClassInstance).toEqual(classInstance);
    });
  });
});
