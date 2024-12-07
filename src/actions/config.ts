import merge from 'lodash/merge';

import type { ORMConfiguration } from '../types/ormConfiguration';

export const config = (
  partialConfiguration: Partial<ORMConfiguration>,
): ORMConfiguration => {
  if (globalThis._JSONAPIORM === undefined) {
    throw new Error(
      'JSON:API ORM has been improperly configured. Please import the library from the package root.',
    );
  }

  const newConfiguration = merge(globalThis._JSONAPIORM, partialConfiguration);

  globalThis._JSONAPIORM = newConfiguration;

  return newConfiguration;
};
