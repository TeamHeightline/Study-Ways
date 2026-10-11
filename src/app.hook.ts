import { useAuth0 } from '@auth0/auth0-react';
import {
  setAccessToken,
  setAccessTokenProvider,
} from './shared/server-layer/query-layer/config';
import {
  getAuthSessionVersion,
  isAuthSessionActive,
} from './shared/server-layer/query-layer/auth-session';
import { useEffect, useRef, useState } from 'react';
import { userApi } from './shared/store/user-store/user-session';
import { clearUserSession } from './shared/store/user-store/session-lifecycle';
import { useAppDispatch } from './app/redux-store/RootStore';

export default function AppHook() {
  const { isLoading, isAuthenticated, getAccessTokenSilently, logout, user } =
    useAuth0();
  const [preparingUser, setPreparingUser] = useState(true);
  const dispatch = useAppDispatch();
  const sessionSubject = useRef<string>();
  const activeSession = isAuthSessionActive();
  // Keep the established identity during a transient SDK state change. The
  // session ends on explicit logout or a terminal Auth0 error;
  // REST calls still require a valid access token before they can be sent.
  const authenticated = isAuthenticated || activeSession;
  const userSubject =
    user?.sub ?? (activeSession ? sessionSubject.current : undefined);
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    let removeTokenProvider: (() => void) | undefined;
    let request:
      | ReturnType<ReturnType<typeof userApi.endpoints.getCurrentUser.initiate>>
      | undefined;
    setPreparingUser(true);
    clearUserSession(dispatch);
    const sessionVersion = getAuthSessionVersion();
    const isCurrent = () =>
      !cancelled && sessionVersion === getAuthSessionVersion();
    if (!authenticated) {
      setPreparingUser(false);
      return;
    }
    sessionSubject.current = userSubject;
    // Use the provider's audience/scope for both login and token renewal.
    const getToken = async () => {
      const token = await getAccessTokenSilently();
      if (!token) throw new Error('Auth0 не вернул токен доступа.');
      return token;
    };
    getToken()
      .then(async token => {
        if (!isCurrent()) return;
        setAccessToken(token);
        removeTokenProvider = setAccessTokenProvider(getToken, () => {
          if (!isCurrent()) return;
          clearUserSession(dispatch);
          // Let the UI offer login again without redirecting or losing the page.
          void logout({ openUrl: false });
        });
        request = dispatch(
          userApi.endpoints.getCurrentUser.initiate(undefined, {
            forceRefetch: true,
          }),
        );
        await request.unwrap();
      })
      .catch(() => {
        if (isCurrent()) clearUserSession(dispatch);
      })
      .finally(() => {
        if (!cancelled) setPreparingUser(false);
      });
    return () => {
      cancelled = true;
      removeTokenProvider?.();
      request?.abort();
      request?.unsubscribe();
    };
  }, [
    isLoading,
    authenticated,
    userSubject,
    getAccessTokenSilently,
    logout,
    dispatch,
  ]);
  return { isLoading: isLoading || preparingUser };
}
