import { Chance } from 'chance';
import { expectORMConfiguration } from '../../src/utils/expectOrmConfiguration';

import type { ORMConfiguration } from '../../src/types/ormConfiguration';

describe('`expectORMConfiguration`', () => {
  let chance: Chance.Chance;

  beforeEach(() => {
    chance = new Chance();
  });

  it('should throw an error if `globalThis._JSONAPIORM` is undefined', async () => {
    expect(() => {
      expectORMConfiguration();
    }).toThrow(
      'JSON:API ORM has been improperly configured. Please import the library from the package root.',
    );
  });

  it('should return `globalThis._JSONAPIORM` if it is defined', async () => {
    globalThis._JSONAPIORM = {
      a: chance.string(),
    } as unknown as ORMConfiguration;

    expect(expectORMConfiguration()).toStrictEqual(globalThis._JSONAPIORM);
  });
});
