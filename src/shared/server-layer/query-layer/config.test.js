import axiosClient, { setAccessToken, setAccessTokenProvider } from './config';
import { getAuthSessionVersion, isAuthSessionActive } from './auth-session';

const response = async config => ({
  data: config.headers.Authorization,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
});
function deferred() {
  let resolve, reject;
  const promise = new Promise((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return { promise, resolve, reject };
}
beforeEach(() => setAccessToken(null));
afterEach(() => setAccessToken(null));

test('all request methods use the latest JWT and logout clears it without stacking interceptors', async () => {
  const initialInterceptors = axiosClient.interceptors.request.handlers.length;
  setAccessToken('first');
  expect((await axiosClient.get('/test', { adapter: response })).data).toBe(
    'Bearer first',
  );
  setAccessToken('second');
  expect((await axiosClient.put('/test', {}, { adapter: response })).data).toBe(
    'Bearer second',
  );
  setAccessToken(null);
  expect(
    (await axiosClient.post('/test', {}, { adapter: response })).data,
  ).toBeUndefined();
  expect(axiosClient.interceptors.request.handlers).toHaveLength(
    initialInterceptors,
  );
});

test('renewal supplies fresh tokens to reads and writes without changing the session', async () => {
  setAccessToken('expired');
  const version = getAuthSessionVersion();
  const getToken = jest
    .fn()
    .mockResolvedValueOnce('renewed')
    .mockResolvedValueOnce('next');
  setAccessTokenProvider(getToken, jest.fn());
  expect((await axiosClient.get('/read', { adapter: response })).data).toBe(
    'Bearer renewed',
  );
  expect(
    (await axiosClient.post('/write', {}, { adapter: response })).data,
  ).toBe('Bearer next');
  expect(getToken).toHaveBeenCalledTimes(2);
  expect(getAuthSessionVersion()).toBe(version);
  expect(isAuthSessionActive()).toBe(true);
});

test('parallel requests share one token lookup and all use its result', async () => {
  const token = deferred();
  const getToken = jest.fn(() => token.promise);
  const adapter = jest.fn(response);
  setAccessToken('expired');
  setAccessTokenProvider(getToken, jest.fn());
  const requests = Promise.all([
    axiosClient.get('/one', { adapter }),
    axiosClient.put('/two', {}, { adapter }),
    axiosClient.delete('/three', { adapter }),
  ]);
  await Promise.resolve();
  await Promise.resolve();
  expect(getToken).toHaveBeenCalledTimes(1);
  expect(adapter).not.toHaveBeenCalled();
  token.resolve('fresh');
  expect((await requests).map(res => res.data)).toEqual(
    Array(3).fill('Bearer fresh'),
  );
});

test.each(['logout', 'switch account'])(
  'a request queued just before %s cannot run in another session',
  async action => {
    const adapter = jest.fn(response);
    const getToken = jest.fn().mockResolvedValue('old');
    setAccessToken('old');
    setAccessTokenProvider(getToken, jest.fn());
    const request = axiosClient.post('/write', {}, { adapter });
    setAccessToken(null);
    if (action === 'switch account') setAccessToken('other-user');
    await expect(request).rejects.toMatchObject({ code: 'ERR_CANCELED' });
    expect(adapter).not.toHaveBeenCalled();
    expect(getToken).not.toHaveBeenCalled();
  },
);

test('logout during renewal cannot restore a token or send a pending write', async () => {
  const token = deferred();
  const started = deferred();
  const adapter = jest.fn(response);
  setAccessToken('old');
  setAccessTokenProvider(() => {
    started.resolve();
    return token.promise;
  }, jest.fn());
  const request = axiosClient.post('/write', {}, { adapter });
  await started.promise;
  setAccessToken(null);
  token.resolve('obsolete');
  await expect(request).rejects.toMatchObject({ code: 'ERR_CANCELED' });
  expect(adapter).not.toHaveBeenCalled();
  expect(axiosClient.defaults.headers.common.Authorization).toBeUndefined();
  expect(isAuthSessionActive()).toBe(false);
});

test('late renewal and cleanup of an old account cannot affect the new account', async () => {
  const token = deferred();
  const started = deferred();
  const expired = jest.fn();
  const adapter = jest.fn(response);
  setAccessToken('old');
  const cleanup = setAccessTokenProvider(() => {
    started.resolve();
    return token.promise;
  }, expired);
  const oldRequest = axiosClient.put('/write', {}, { adapter });
  await started.promise;
  setAccessToken(null);
  setAccessToken('new');
  const getToken = jest.fn().mockResolvedValue('new-renewed');
  setAccessTokenProvider(getToken, jest.fn());
  cleanup();
  token.resolve('old-renewed');
  await expect(oldRequest).rejects.toMatchObject({ code: 'ERR_CANCELED' });
  expect(expired).not.toHaveBeenCalled();
  expect(adapter).not.toHaveBeenCalled();
  expect((await axiosClient.get('/new', { adapter })).data).toBe(
    'Bearer new-renewed',
  );
  expect(getToken).toHaveBeenCalledTimes(1);
});

test('an old account renewal error cannot expire the new session', async () => {
  const token = deferred();
  const started = deferred();
  const expired = jest.fn();
  setAccessToken('old');
  setAccessTokenProvider(() => {
    started.resolve();
    return token.promise;
  }, expired);
  const request = axiosClient.get('/old', { adapter: response });
  await started.promise;
  setAccessToken(null);
  setAccessToken('new');
  token.reject({ error: 'invalid_grant' });
  await expect(request).rejects.toMatchObject({ error: 'invalid_grant' });
  expect(expired).not.toHaveBeenCalled();
  expect(axiosClient.defaults.headers.common.Authorization).toBe('Bearer new');
});

test('a response arriving after logout cannot supply old private data', async () => {
  const server = deferred();
  const started = deferred();
  setAccessToken('old');
  const request = axiosClient.get('/private', {
    adapter: config => {
      started.resolve();
      return server.promise.then(() => response(config));
    },
  });
  await started.promise;
  setAccessToken(null);
  server.resolve();
  await expect(request).rejects.toMatchObject({ code: 'ERR_CANCELED' });
});

test.each([new Error('Network error'), { error: 'timeout' }])(
  'a transient renewal failure keeps the session and the next request can recover',
  async error => {
    const expired = jest.fn();
    const adapter = jest.fn(response);
    const getToken = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('recovered');
    setAccessToken('old');
    const version = getAuthSessionVersion();
    setAccessTokenProvider(getToken, expired);
    await expect(axiosClient.post('/write', {}, { adapter })).rejects.toBe(
      error,
    );
    expect(adapter).not.toHaveBeenCalled();
    expect(expired).not.toHaveBeenCalled();
    expect(isAuthSessionActive()).toBe(true);
    expect(getAuthSessionVersion()).toBe(version);
    expect((await axiosClient.post('/write', {}, { adapter })).data).toBe(
      'Bearer recovered',
    );
    expect(adapter).toHaveBeenCalledTimes(1);
  },
);

test.each([
  'login_required',
  'consent_required',
  'interaction_required',
  'invalid_grant',
  'missing_refresh_token',
])('Auth0 %s expires the session once for parallel requests', async error => {
  const expired = jest.fn(() => setAccessToken(null));
  const adapter = jest.fn(response);
  const getToken = jest.fn().mockRejectedValue({ error });
  setAccessToken('old');
  setAccessTokenProvider(getToken, expired);
  const results = await Promise.allSettled([
    axiosClient.get('/one', { adapter }),
    axiosClient.get('/two', { adapter }),
  ]);
  expect(results.map(result => result.status)).toEqual([
    'rejected',
    'rejected',
  ]);
  expect(getToken).toHaveBeenCalledTimes(1);
  expect(expired).toHaveBeenCalledTimes(1);
  expect(adapter).not.toHaveBeenCalled();
  expect(isAuthSessionActive()).toBe(false);
});

test('aborting one waiting request does not cancel renewal for another request', async () => {
  const token = deferred();
  const started = deferred();
  const adapter = jest.fn(response);
  const controller = new AbortController();
  setAccessToken('old');
  setAccessTokenProvider(() => {
    started.resolve();
    return token.promise;
  }, jest.fn());
  const canceled = axiosClient.get('/canceled', {
    adapter,
    signal: controller.signal,
  });
  const valid = axiosClient.get('/valid', { adapter });
  await started.promise;
  controller.abort();
  token.resolve('renewed');
  await expect(canceled).rejects.toMatchObject({ code: 'ERR_CANCELED' });
  expect((await valid).data).toBe('Bearer renewed');
  expect(adapter).toHaveBeenCalledTimes(1);
});

test('an API rejection never automatically repeats a write', async () => {
  const adapter = jest.fn().mockRejectedValue({ response: { status: 401 } });
  setAccessToken('old');
  setAccessTokenProvider(jest.fn().mockResolvedValue('fresh'), jest.fn());
  await expect(
    axiosClient.post('/write', {}, { adapter }),
  ).rejects.toMatchObject({ response: { status: 401 } });
  expect(adapter).toHaveBeenCalledTimes(1);
  expect(isAuthSessionActive()).toBe(true);
});
