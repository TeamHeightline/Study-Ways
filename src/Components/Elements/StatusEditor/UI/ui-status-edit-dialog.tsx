import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {RootState, useAppDispatch} from "../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {cancelUserEdit} from "../redux-store/StatusEditorSlice";


interface IUIStatusEditDialogProps extends BoxProps {

}

export default function UIStatusEditDialog({...props}: IUIStatusEditDialogProps) {
    const dispatch = useAppDispatch()
    const selectedUser = useSelector((state: RootState) => state.statusEditor.selectedUser)


    function handleClose() {
        dispatch(cancelUserEdit())
    }

    const isOpen = !!selectedUser
    return (
        <Box {...props}>
            <Dialog
                open={isOpen}
                keepMounted
                onClose={handleClose}
                aria-describedby="status-editor-menu"
            >
                <DialogTitle>{"Редактор статуса"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} startIcon={<CancelIcon/>}>Отмена</Button>
                    <Button onClick={handleClose} startIcon={<SaveIcon/>}>Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
