import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type IAuth0LoginProps = React.HTMLAttributes<HTMLDivElement>;

const Auth0Login = observer(({ ...props }: IAuth0LoginProps) => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, []);
  return <div {...props}></div>;
});

export default Auth0Login;
