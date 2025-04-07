export function removeUndefinedAttribute<T>(data: Partial<T>): Partial<T> {
  const newData: Partial<T> = {};
  for (const key in data) {
    if (data[key] !== undefined) {
      newData[key] = data[key];
    }
  }
  return newData;
}