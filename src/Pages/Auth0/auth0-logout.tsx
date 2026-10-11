import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from '../../Shared/ServerLayer/QueryLayer/config';
import { studyWaysApi } from '../../Shared/ServerLayer/QueryLayer/api';
import { useAppDispatch } from '../../App/ReduxStore/RootStore';
import { UserStorage } from '../../Shared/Store/UserStore/UserStore';

type IAuth0LogoutProps = React.HTMLAttributes<HTMLDivElement>;

const Auth0Logout = observer(({ ...props }: IAuth0LogoutProps) => {
  const { logout, isAuthenticated } = useAuth0();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    }
    setAccessToken(null);
    UserStorage.user_data = null;
    dispatch(studyWaysApi.util.resetApiState());
    dispatch({ type: 'session/reset' });
  }, []);
  return <div {...props}></div>;
});

export default Auth0Logout;
