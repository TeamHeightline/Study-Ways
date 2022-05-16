import {observer} from "mobx-react";
import React, {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {UserStorage} from "../../../Store/UserStore/UserStore";

export const ProfileNotification = observer(() => {
    const [isOpen, setIsOpen] = useState(true)
    const history = useHistory()

    if (UserStorage.isLogin && UserStorage?.profileLoaded && !UserStorage.profile?.lastname) {
        return (
            <div>
                <Dialog
                    open={isOpen}
                >
                    <DialogTitle>{"Заполните прифиль"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Для того, чтобы было удобно обрабатывать статистику,
                            нам нужно знать вашу <strong>фамилию</strong> и
                            некоторые другие данные
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setIsOpen(false)
                            history.push("/profile")
                        }} color="primary">
                            Редактировать профиль
                        </Button>
                        <Button
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