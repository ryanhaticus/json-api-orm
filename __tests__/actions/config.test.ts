import { Chance } from 'chance';
import { config } from '../../src/actions/config';
import { expectORMConfiguration } from '../../src/utils/expectOrmConfiguration';

import type { ORMConfiguration } from '../../src/types/ormConfiguration';

jest.mock('../../src/utils/expectOrmConfiguration');
const expectORMConfigurationMocked = jest.mocked(expectORMConfiguration);

describe('`config`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should merge the partial configuration with the existing configuration', () => {
    const existingConfiguration = {
      a: chance.string(),
      b: {
        c: chance.string(),
      },
      d: chance.string(),
    } as unknown as ORMConfiguration;

    expectORMConfigurationMocked.mockReturnValue(existingConfiguration);

    const partialConfiguration = {
      b: {
        c: chance.string(),
        e: chance.string(),
      },
      d: chance.string(),
    } as unknown as ORMConfiguration;

    config(partialConfiguration);

    expect(globalThis._JSONAPIORM).toEqual({
      ...existingConfiguration,
      ...partialConfiguration,
    });
  });
});
