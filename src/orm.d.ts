import type { ORMConfiguration } from './types/ormConfiguration';

declare global {
  var _JSONAPIORM: ORMConfiguration | undefined;
}
