import {
  activateAuthSession,
  getAuthSessionVersion,
  invalidateAuthSession,
} from './auth-session';
import axios, { AxiosRequestConfig, CanceledError } from 'axios';
import { REST_SERVER_URL } from '../../../settings';

type SessionRequestConfig = AxiosRequestConfig & {
  authSessionVersion: number;
};
type AccessTokenProvider = {
  getToken: () => Promise<string>;
  onSessionExpired: () => void;
};

const axiosClient = axios.create({
  baseURL: REST_SERVER_URL,
  // Axios copies this value when a request is created, before async interceptors.
  authSessionVersion: getAuthSessionVersion(),
} as SessionRequestConfig);
let tokenProvider: AccessTokenProvider | undefined;
let pendingToken: Promise<string> | undefined;

export function setAccessToken(token: string | null) {
  if (token) {
    activateAuthSession();
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    invalidateAuthSession();
    tokenProvider = undefined;
    pendingToken = undefined;
    delete axiosClient.defaults.headers.common.Authorization;
  }
  (
    axiosClient.defaults as typeof axiosClient.defaults & {
      authSessionVersion: number;
    }
  ).authSessionVersion = getAuthSessionVersion();
}

export function setAccessTokenProvider(
  getToken: AccessTokenProvider['getToken'],
  onSessionExpired: AccessTokenProvider['onSessionExpired'],
) {
  const provider = { getToken, onSessionExpired };
  tokenProvider = provider;
  pendingToken = undefined;
  return () => {
    if (tokenProvider === provider) {
      tokenProvider = undefined;
      pendingToken = undefined;
    }
  };
}

function requireCurrentSession(config: SessionRequestConfig) {
  if (
    config.authSessionVersion !== getAuthSessionVersion() ||
    config.signal?.aborted
  ) {
    throw new CanceledError('Сессия изменилась или запрос был отменён.');
  }
}

function getCurrentAccessToken(provider: AccessTokenProvider) {
  if (!pendingToken) {
    const sessionVersion = getAuthSessionVersion();
    const request = Promise.resolve()
      // Auth0 returns its cached token, or renews it when expiry is near.
      .then(() => provider.getToken())
      .then(token => {
        if (
          tokenProvider !== provider ||
          sessionVersion !== getAuthSessionVersion()
        ) {
          throw new CanceledError(
            'Сессия изменилась во время обновления токена.',
          );
        }
        setAccessToken(token);
        return token;
      })
      .catch(error => {
        if (
          tokenProvider === provider &&
          sessionVersion === getAuthSessionVersion() &&
          [
            'login_required',
            'consent_required',
            'interaction_required',
            'invalid_grant',
            'missing_refresh_token',
          ].includes(error?.error)
        ) {
          provider.onSessionExpired();
        }
        // Network/timeout failures leave the session intact for the next request.
        throw error;
      })
      .finally(() => {
        if (pendingToken === request) pendingToken = undefined;
      });
    pendingToken = request;
  }
  return pendingToken;
}

// Installed once for RTK Query and the remaining direct Axios calls.
axiosClient.interceptors.request.use(async config => {
  const request = config as SessionRequestConfig;
  requireCurrentSession(request);
  if (tokenProvider) {
    const token = await getCurrentAccessToken(tokenProvider);
    requireCurrentSession(request);
    request.headers = { ...request.headers, Authorization: `Bearer ${token}` };
  }
  return request;
});
axiosClient.interceptors.response.use(response => {
  requireCurrentSession(response.config as SessionRequestConfig);
  return response;
});

export default axiosClient;
