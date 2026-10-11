import axiosClient, { setAccessToken } from './config';
test('all request methods use the latest JWT and logout clears it without stacking interceptors', async () => {
  const initialInterceptors = axiosClient.interceptors.request.handlers.length;
  const adapter = async config => ({
    data: config.headers.Authorization,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });
  setAccessToken('first');
  expect(
    (await axiosClient.request({ url: '/test', method: 'GET', adapter })).data,
  ).toBe('Bearer first');
  setAccessToken('second');
  expect(
    (
      await axiosClient.request({
        url: '/test',
        method: 'PUT',
        data: {},
        adapter,
      })
    ).data,
  ).toBe('Bearer second');
  setAccessToken(null);
  expect(
    (await axiosClient.request({ url: '/test', method: 'POST', adapter })).data,
  ).toBeUndefined();
  expect(axiosClient.interceptors.request.handlers).toHaveLength(
    initialInterceptors,
  );
});
