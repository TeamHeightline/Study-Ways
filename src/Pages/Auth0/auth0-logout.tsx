import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ClientStorage } from "../../Shared/Store/ApolloStorage/ClientStorage";

type IAuth0LogoutProps = React.HTMLAttributes<HTMLDivElement>;

const Auth0Logout = observer(({ ...props }: IAuth0LogoutProps) => {
  const { logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    }
    ClientStorage.changeToken("");
  }, []);
  return <div {...props}></div>;
});

export default Auth0Logout;
