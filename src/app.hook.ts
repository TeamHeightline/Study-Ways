import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from './Shared/ServerLayer/QueryLayer/config';
import { studyWaysApi } from './Shared/ServerLayer/QueryLayer/api';
import { useEffect, useState } from 'react';
import { UserStorage } from './Shared/Store/UserStore/UserStore';
import { useAppDispatch } from './App/ReduxStore/RootStore';

export default function AppHook() {
  const { isLoading, isAuthenticated, getAccessTokenSilently, user } =
    useAuth0();
  const [preparingUser, setPreparingUser] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    setPreparingUser(true);
    setAccessToken(null);
    UserStorage.user_data = null;
    dispatch(studyWaysApi.util.resetApiState());
    dispatch({ type: 'session/reset' });
    if (!isAuthenticated) {
      setPreparingUser(false);
      return;
    }
    getAccessTokenSilently({
      audience: 'sw-backend-identifier',
      scope: 'read:current_user',
    })
      .then(async token => {
        if (cancelled) return;
        setAccessToken(token);
        await UserStorage.reloadUser(() => !cancelled);
      })
      .catch(() => {
        if (!cancelled) setAccessToken(null);
      })
      .finally(() => {
        if (!cancelled) setPreparingUser(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoading, isAuthenticated, user?.sub, getAccessTokenSilently, dispatch]);
  return { isLoading: isLoading || preparingUser };
}
