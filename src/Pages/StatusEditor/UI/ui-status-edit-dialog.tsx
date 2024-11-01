import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {RootState, useAppDispatch} from "../../../App/ReduxStore/RootStore";
import {useSelector} from "react-redux";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {cancelUserEdit, changeSelectedUserStatus} from "../redux-store/StatusEditorSlice";
import {LoadingButton} from "@mui/lab";
import {updateUserStatusAsync} from "../redux-store/AsyncActions";


interface IUIStatusEditDialogProps extends BoxProps {

}

export default function UIStatusEditDialog({...props}: IUIStatusEditDialogProps) {
    const dispatch = useAppDispatch()
    const pending_update_user_status = useSelector((state: RootState) => state.statusEditor.pending_update_user_status)
    const selectedUser = useSelector((state: RootState) => state.statusEditor.selectedUser)

    function handleClose() {
        dispatch(cancelUserEdit())
    }

    function saveUserStatus() {
        if (selectedUser) {
            dispatch(updateUserStatusAsync({
                user_id: selectedUser.id,
                user_access_level: selectedUser.user_access_level
            }))
                .unwrap()
                .then((userData) => {
                    if (userData) {
                        handleClose()
                    }
                })
        }
    }

    function changeUserStatus(event) {
        dispatch(changeSelectedUserStatus(event.target.value))
    }

    const isOpen = !!selectedUser
    return (
        <Box {...props}>
            <Dialog
                open={isOpen}
                fullWidth
                maxWidth={"xs"}
                keepMounted
                onClose={handleClose}
                aria-describedby="status-editor-menu"
            >
                <DialogTitle>{"Редактор статуса"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="selected-user-data" variant={"h5"}>
                        Email: {selectedUser?.username}
                        <br/>
                        Имя: {selectedUser?.users_userprofile?.firstname || "Не указано"}
                        <br/>
                        Фамилия: {selectedUser?.users_userprofile?.lastname || "Не указано"}
                    </DialogContentText>

                    <Box sx={{mt: 2}}>
                        <FormControl fullWidth>
                            <InputLabel sx={{mt: 2}}>Статус</InputLabel>
                            <Select
                                variant={"filled"}
                                value={selectedUser?.user_access_level || "STUDENT"}
                                onChange={changeUserStatus}
                                label="Статус"
                            >
                                <MenuItem value={"STUDENT"}>Студент</MenuItem>
                                <MenuItem value={"CARD_EDITOR"}>Студент с правом создания карточек</MenuItem>
                                <MenuItem value={"TEACHER"}>Преподаватель</MenuItem>
                                <MenuItem value={"ADMIN"}>Администратор</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} startIcon={<CancelIcon/>}>Отмена</Button>
                    <LoadingButton onClick={saveUserStatus} startIcon={<SaveIcon/>}
                                   loading={!!pending_update_user_status}
                        // error={!!update_user_status_error && "Ошибка сохранения"}
                    >
                        Сохранить
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
