import { observer } from 'mobx-react';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

type LogInNotificationProps = {
  requireShow?: boolean;
};

export const RequireLogInAlert = observer(
  ({ requireShow = false }: LogInNotificationProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const handleClose = () => setIsOpen(false);
    const { isLoading, loginWithPopup, isAuthenticated } = useAuth0();

    if (isAuthenticated || isLoading) {
      return <div />;
    }

    if (!requireShow) {
      return (
        <Snackbar
          open={isOpen}
          autoHideDuration={20000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Alert
            className="sw-login-alert"
            onClose={handleClose}
            severity="info"
            sx={{ width: '100%' }}
            variant="filled"
            action={
              <Button
                onClick={loginWithPopup}
                className="sw-login-alert-button"
                variant={'contained'}
                color={'inherit'}
                startIcon={<LoginRoundedIcon fontSize="small" />}
              >
                Войти
              </Button>
            }
          >
            Пожалуйста, войдите в аккаунт
          </Alert>
        </Snackbar>
      );
    }

    return (
      <div>
        {(isOpen || requireShow) && (
          <Stack alignItems={'center'} sx={{ width: '100%' }}>
            <Alert
              className="sw-login-alert sw-login-alert-block"
              onClose={handleClose}
              severity="error"
              sx={{ maxWidth: 500, my: 8 }}
              variant="filled"
              action={
                <Button
                  onClick={loginWithPopup}
                  className="sw-login-alert-button"
                  variant={'contained'}
                  color={'inherit'}
                  startIcon={<LoginRoundedIcon fontSize="small" />}
                >
                  Войти
                </Button>
              }
            >
              <AlertTitle>Войдите в аккаунт</AlertTitle>
              Элементы, связанные с тестированием (вопросы/серии
              вопросов/экзамены) обязательно требуют авторизации
            </Alert>
          </Stack>
        )}
      </div>
    );
  },
);
