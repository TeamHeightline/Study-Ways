import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from '../../App/ReduxStore/RootStore';
import { clearUserSession } from '../../Shared/Store/UserStore/session-lifecycle';

type IAuth0LogoutProps = React.HTMLAttributes<HTMLDivElement>;
export default function Auth0Logout(props: IAuth0LogoutProps) {
  const { logout, isAuthenticated } = useAuth0();
  const dispatch = useAppDispatch();
  useEffect(() => {
    clearUserSession(dispatch);
    if (isAuthenticated) logout({ returnTo: window.location.origin });
  }, [dispatch, isAuthenticated, logout]);
  return <div {...props} />;
}
