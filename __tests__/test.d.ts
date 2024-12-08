import type { ORMConfiguration } from '../src/types/ormConfiguration';

declare global {
  var _JSONAPIORM: ORMConfiguration | undefined;
}
