import React from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct } from 'react-dom/test-utils';
import { useAutosavedDraft } from './use-autosaved-draft';
import { serializeWrite } from '../server-layer/query-layer/write-queue';
const act = React.act || legacyAct;
let root, host, current, save;
function Form() {
  current = useAutosavedDraft({ name: 'Начало' }, save);
  return <output>{current.draft.name}</output>;
}
const settle = () =>
  act(async () => {
    await Promise.resolve();
  });
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.useFakeTimers();
  save = jest.fn().mockResolvedValue({});
  host = document.createElement('div');
  root = createRoot(host);
  await act(async () => root.render(<Form />));
});
afterEach(async () => {
  await act(async () => root.unmount());
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
test('initial data is never saved; rapid edits produce one latest snapshot', async () => {
  await act(async () => jest.advanceTimersByTime(2000));
  expect(save).not.toHaveBeenCalled();
  await act(async () => {
    current.updateDraft(() => ({ name: 'Первое' }));
    current.updateDraft(() => ({ name: 'Второе' }));
  });
  await act(async () => jest.advanceTimersByTime(1500));
  expect(save).toHaveBeenCalledTimes(1);
  expect(save).toHaveBeenCalledWith({ name: 'Второе' });
  expect(current.state).toBe('saved');
});
test('an edit made during a request is saved afterwards and is not replaced by the old response', async () => {
  let finish;
  save.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await act(async () => current.updateDraft(() => ({ name: 'Первое' })));
  await act(async () => jest.advanceTimersByTime(1500));
  await act(async () => current.updateDraft(() => ({ name: 'Второе' })));
  expect(current.draft.name).toBe('Второе');
  expect(save).toHaveBeenCalledTimes(1);
  await act(async () => finish({ name: 'Устаревший ответ' }));
  await settle();
  expect(save.mock.calls.map(([data]) => data.name)).toEqual([
    'Первое',
    'Второе',
  ]);
  expect(current.draft.name).toBe('Второе');
  expect(current.state).toBe('saved');
});
test('failed saving preserves the draft and explicit retry saves it', async () => {
  save.mockRejectedValueOnce(new Error('offline'));
  await act(async () => current.updateDraft(() => ({ name: 'Черновик' })));
  await act(async () => jest.advanceTimersByTime(1500));
  expect(current.state).toBe('error');
  expect(current.draft.name).toBe('Черновик');
  await act(async () => expect(await current.saveNow()).toBe(true));
  expect(current.state).toBe('saved');
});
test('leaving a form flushes a pending edit', async () => {
  await act(async () => current.updateDraft(() => ({ name: 'Перед уходом' })));
  await act(async () => root.render(null));
  expect(save).toHaveBeenCalledWith({ name: 'Перед уходом' });
});
test('writes to the same record are serialized and failure does not block later saves', async () => {
  let finish;
  const events = [];
  const first = serializeWrite(
    'record-1',
    () =>
      new Promise(resolve => {
        events.push('first');
        finish = resolve;
      }),
  );
  const second = serializeWrite('record-1', async () => {
    events.push('second');
    throw new Error('offline');
  });
  const rejected = second.catch(() => events.push('failed'));
  const third = serializeWrite('record-1', async () => {
    events.push('third');
    return 3;
  });
  await Promise.resolve();
  await Promise.resolve();
  expect(events).toEqual(['first']);
  await serializeWrite('record-2', async () => events.push('independent'));
  finish();
  await first;
  await rejected;
  expect(await third).toBe(3);
  expect(events).toEqual(['first', 'independent', 'second', 'failed', 'third']);
});
