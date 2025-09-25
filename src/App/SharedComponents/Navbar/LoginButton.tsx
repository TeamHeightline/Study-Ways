import { observer } from "mobx-react";
import { Button } from "@mui/material";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginIcon from "@mui/icons-material/Login";

export const LoginButton = observer(() => {
  const { loginWithPopup } = useAuth0();

  return (
    <Button
      startIcon={<LoginIcon />}
      sx={{ color: "white" }}
      onClick={() => {
        loginWithPopup();
      }}
    >
      Войти
    </Button>
  );
});
