import { executeMutation, executeQueuedMutation } from './execute-mutation';
import { activateAuthSession, invalidateAuthSession } from './auth-session';
import reduxStore from '../../../app/redux-store/RootStore';
jest.mock('../../../app/redux-store/RootStore', () => ({
  __esModule: true,
  default: { dispatch: jest.fn() },
}));
test('a queued save is cancelled when the account changes before it starts', async () => {
  activateAuthSession();
  let finish;
  const reset = jest.fn();
  reduxStore.dispatch.mockReturnValue({
    unwrap: () =>
      new Promise(resolve => {
        finish = resolve;
      }),
    reset,
  });
  const first = executeQueuedMutation('same-record', 'first');
  const second = executeQueuedMutation('same-record', 'second');
  const rejected = expect(second).rejects.toThrow('Сессия изменилась');
  await Promise.resolve();
  await Promise.resolve();
  invalidateAuthSession();
  finish({ id: 1 });
  await first;
  await rejected;
  expect(reduxStore.dispatch).toHaveBeenCalledTimes(1);
  expect(reset).toHaveBeenCalledTimes(1);
});
test('failed commands release their RTK mutation entry', async () => {
  const reset = jest.fn();
  reduxStore.dispatch.mockReturnValue({
    unwrap: () => Promise.reject(new Error('offline')),
    reset,
  });
  await expect(executeMutation('operation')).rejects.toThrow('offline');
  expect(reset).toHaveBeenCalledTimes(1);
});
