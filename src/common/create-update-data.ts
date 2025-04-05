export function createUpdateData<T>(command: Partial<T>): Partial<T> {
  const updateData: Partial<T> = {};
  for (const key in command) {
    if (command[key] !== undefined) {
      updateData[key] = command[key];
    }
  }
  return updateData;
}