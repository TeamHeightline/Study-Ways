import {observer} from "mobx-react";
import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {useAuth0} from "@auth0/auth0-react";
import {Alert, AlertTitle, Snackbar, Stack} from "@mui/material";

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
            {(isOpen || requireShow) && (
                <Stack alignItems={"center"} sx={{width: "100%"}}>
                    <Alert onClose={handleClose} severity="error"
                           sx={{maxWidth: 500, my: 8}}
                           variant="filled"
                           action={
                               <Button onClick={loginWithPopup} variant={"outlined"} color={"inherit"}>
                                   Войти
                               </Button>
                           }
                    >
                        <AlertTitle>Войдите в аккаунт</AlertTitle>
                        Элементы, связанные с тестированием (вопросы/серии вопросов/экзамены) обязательно требуют
                        авторизации
                    </Alert>
                </Stack>
            )}
        </div>
    )

})
