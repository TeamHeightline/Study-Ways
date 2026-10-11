import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from './shared/server-layer/query-layer/config';
import { getAuthSessionVersion } from './shared/server-layer/query-layer/auth-session';
import { useEffect, useState } from 'react';
import { userApi } from './shared/store/user-store/user-session';
import { clearUserSession } from './shared/store/user-store/session-lifecycle';
import { useAppDispatch } from './app/redux-store/RootStore';

export default function AppHook() {
  const { isLoading, isAuthenticated, getAccessTokenSilently, user } =
    useAuth0();
  const [preparingUser, setPreparingUser] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    let request:
      | ReturnType<ReturnType<typeof userApi.endpoints.getCurrentUser.initiate>>
      | undefined;
    setPreparingUser(true);
    clearUserSession(dispatch);
    const sessionVersion = getAuthSessionVersion();
    const isCurrent = () =>
      !cancelled && sessionVersion === getAuthSessionVersion();
    if (!isAuthenticated) {
      setPreparingUser(false);
      return;
    }
    getAccessTokenSilently({
      audience: 'sw-backend-identifier',
      scope: 'read:current_user',
    })
      .then(async token => {
        if (!isCurrent()) return;
        setAccessToken(token);
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
      request?.abort();
      request?.unsubscribe();
    };
  }, [isLoading, isAuthenticated, user?.sub, getAccessTokenSilently, dispatch]);
  return { isLoading: isLoading || preparingUser };
}
