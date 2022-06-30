import {observer} from "mobx-react";
import React, {useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useAuth0} from "@auth0/auth0-react";
import {Alert, Snackbar} from "@mui/material";

type LogInNotificationProps = {
    requireShow?: boolean
}

export const LogInNotification = observer(({requireShow = false}: LogInNotificationProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const handleClose = () => setIsOpen(false)
    const {
        isLoading,
        loginWithPopup,
        isAuthenticated,
    } = useAuth0();

    if (isAuthenticated || isLoading) {
        return <div/>
    }

    if (!requireShow) {
        return (
            <Snackbar open={isOpen}
                      autoHideDuration={20000}
                      onClose={handleClose}

                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                      }}>
                <Alert onClose={handleClose} severity="info" sx={{width: '100%'}}
                       variant="filled"
                       action={
                           <Button onClick={loginWithPopup} variant={"outlined"} color={"inherit"}>
                               Войти
                           </Button>
                       }
                >
                    Пожалуйста, войдите в аккаунт
                </Alert>
            </Snackbar>
        )
    }


    return (
        <div>
            <Dialog
                open={isOpen || requireShow}
            >
                <DialogTitle>{"Пожалуйста, войдите в аккаунт"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Мы будем благодарны, если Вы войдете в аккаунт,
                        это позволит сохранять вашу статистику по тестам и
                        рекомендовать вам ресурсы на основе ваших интересов.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        loginWithPopup()
                            .then(handleClose)
                    }} color="primary">
                        Войти
                    </Button>
                    <Button
                        disabled={requireShow}
                        onClick={handleClose} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )

})
