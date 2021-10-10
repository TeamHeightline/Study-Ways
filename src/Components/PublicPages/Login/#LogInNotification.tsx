import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { useHistory } from "react-router-dom";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {TextField} from "@material-ui/core";


export const LogInNotification = observer(() =>{
    const [isOpen, setIsOpen] = useState(false)
    const [openTemporaryNickname, setOpenTemporaryNickname] = useState(false)

    //Создаем задержку, потому что данные о пользователе загружаются не моментально
    useEffect(() =>{
        setTimeout(checkIsLoginAndUserName,3000)
    }, [])

    const checkIsLoginAndUserName = () =>{
        if(!UserStorage.isLogin && !localStorage.getItem("username")){
            setIsOpen(true)
        }
    }

    const history = useHistory();

    if(openTemporaryNickname){
        return (
            <TemporaryNickname goBack={() => setOpenTemporaryNickname(false)}/>
        )
    }

    return(
        <div>
            <Dialog
                open={isOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Пожалуйста, войдите в аккаунт или введите свое имя"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Мы будем благодарны, если Вы войдете в аккаунт или введете имя по которому Вас можно будет
                        идентифицировать. Спасибо за вашу помощь
                        @Команда Study Ways
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        history.push('/login')
                        setIsOpen(false)
                    }} color="primary" autoFocus>
                        Войти
                    </Button>
                    <Button onClick={() => {
                        setOpenTemporaryNickname(true)
                    }} color="primary">
                        Ввести временный ник
                    </Button>
                    <Button onClick={() => setIsOpen(false)} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
const TemporaryNickname = observer(({goBack}) =>{
    const [isOpen, setIsOpen] = useState(true)
    const [nickname, setNickname] = useState('')
    const [validNickname, setValidNickname] = useState(true)
    const saveNickname = () =>{
        if(!nickname || !nickname.replace(/\s/g, '').length){
            setValidNickname(false)
        }else{
            localStorage.setItem("username", nickname)
            setIsOpen(false)
        }
    }
    return(
        <div>
            <Dialog open={isOpen}>
                <DialogTitle id="alert-dialog-title">{"Пожалуйста, введите временное имя пользователя"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Временное имя - это не самый лучший вариант, оно сохраняется только на этом устройстве и будет
                        удалено из Вашего браузера, если вы решите его почистить. Команда Study Ways рекомендует
                        зарегистрироваться, это поможет нам отслеживать Ваш прогресс, а в будущем мы сможем отображать
                        Вашу личную статистику в специальном разделе
                    </DialogContentText>
                    <TextField
                        error={!validNickname}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Временный ник"
                        type="text"
                        fullWidth
                        variant="outlined"
                        helperText={validNickname ? "" : "Временное имя не может быть пустым"}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        saveNickname()
                    }} color="primary">
                        Сохранить
                    </Button>
                    <Button onClick={() => goBack()} color="primary">
                        Назад
                    </Button>
                    <Button onClick={() => setIsOpen(false)} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})