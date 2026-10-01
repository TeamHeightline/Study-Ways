import { observer } from 'mobx-react';
import React from 'react';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

type LogInNotificationProps = {
  requireShow?: boolean;
};

export const RequireLogInAlert = observer(
  ({ requireShow = false }: LogInNotificationProps) => {
    const { isLoading, loginWithPopup, isAuthenticated } = useAuth0();

    if (isAuthenticated || isLoading) {
      return <div />;
    }

    if (!requireShow) return null;

    return (
      <section className="sw-login-required" aria-labelledby="sw-login-required-title">
        <div className="sw-login-required-icon"><LockOpenRoundedIcon /></div>
        <h2 id="sw-login-required-title">Войдите, чтобы продолжить</h2>
        <p>Для прохождения тестов и экзаменов нужен аккаунт.</p>
        <Button onClick={loginWithPopup} variant="contained" disableElevation startIcon={<LoginRoundedIcon />} className="sw-login-required-button">Войти в аккаунт</Button>
      </section>
    );
  },
);
