import type { ORMConfiguration } from '../types';

export const expectORMConfiguration = (): ORMConfiguration => {
  if (globalThis._JSONAPIORM === undefined) {
    throw new Error(
      'JSON:API ORM has been improperly configured. Please import the library from the package root.',
    );
  }

  return globalThis._JSONAPIORM;
};
