// Keep saves for one record in order while unrelated records remain independent.
const queues = new Map<string, Promise<unknown>>();
export function serializeWrite<T>(
  key: string,
  write: () => Promise<T>,
): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const request = previous.catch(() => undefined).then(write);
  queues.set(key, request);
  void request
    .finally(() => {
      if (queues.get(key) === request) queues.delete(key);
    })
    .catch(() => undefined);
  return request;
}
