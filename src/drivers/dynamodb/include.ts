import { isRelationshipObject } from '@tsmetadata/json-api';
import { get } from './get';

export const include = async <I extends object, C>(
  classInstance: I,
  relationshipKey: keyof I,
  // biome-ignore lint/suspicious/noExplicitAny: `any` is required to support all class constructors.
  cls: new (..._: any[]) => C,
) => {
  const relationshipObjectCandidate = classInstance[relationshipKey];

  if (!isRelationshipObject(relationshipObjectCandidate)) {
    return;
  }

  const { data } = relationshipObjectCandidate;

  if (Array.isArray(data)) {
    classInstance[relationshipKey] = [] as I[keyof I];

    for (const { id } of data) {
      classInstance[relationshipKey] = [
        ...(classInstance[relationshipKey] as I[keyof I][]),
        await get(cls, id),
      ] as I[keyof I];
    }

    return;
  }

  if (data === null) {
    return;
  }

  const { id } = data;

  classInstance[relationshipKey] = (await get(cls, id)) as I[keyof I];
};
