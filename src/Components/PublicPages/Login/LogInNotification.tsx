import {observer} from "mobx-react";
import React, {useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {useAuth0} from "@auth0/auth0-react";

type LogInNotificationProps = {
    requireShow?: boolean
}

export const LogInNotification = observer(({requireShow = false}: LogInNotificationProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const {
        isLoading,
        loginWithPopup,
        isAuthenticated,
    } = useAuth0();

    if (!isAuthenticated && !isLoading) {
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
                                .then(() => {
                                    setIsOpen(false)
                                })
                        }} color="primary">
                            Войти
                        </Button>
                        <Button
                            disabled={requireShow}
                            onClick={() => setIsOpen(false)} color="primary">
                            Закрыть
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    } else {
        return (<div/>)
    }
})