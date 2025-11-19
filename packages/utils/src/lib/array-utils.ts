// packages/utils/src/lib/array-utils.ts

type Item = { id: string };

const updateItemInArray = <T extends Item>(array: T[], updated: T): T[] => {
  const result: T[] = [];
  for (const item of array) {
    result.push(item.id === updated.id ? updated : item);
  }
  return result;
};

export { updateItemInArray };