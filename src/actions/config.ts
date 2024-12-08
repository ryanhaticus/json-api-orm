import merge from 'lodash/merge';
import { expectORMConfiguration } from '../utils/expectOrmConfiguration';

import type { ORMConfiguration } from '../types/ormConfiguration';

export const config = (
  partialConfiguration: Partial<ORMConfiguration>,
): ORMConfiguration => {
  const ormConfiguration = expectORMConfiguration();

  const newConfiguration = merge(ormConfiguration, partialConfiguration);

  globalThis._JSONAPIORM = newConfiguration;

  return newConfiguration;
};
