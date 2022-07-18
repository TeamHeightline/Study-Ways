import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {saveDetailStatisticAsync} from "../../redux-store/async-actions";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUiComebackLaterDialogProps extends PaperProps {
    isOpenComeBackLaterDialog: boolean,
    setIsOpenComeBackLaterDialog: any
}

export default function UiComebackLaterDialog({
                                                  isOpenComeBackLaterDialog,
                                                  setIsOpenComeBackLaterDialog,
                                                  ...props
                                              }: IUiComebackLaterDialogProps) {
    const store = useSelector((state: RootState) => state?.ExamByUIDReducer)
    const dispatch: any = useDispatch();

    function saveProgress() {
        dispatch(saveDetailStatisticAsync(store))
    }

    return (
        <Dialog
            onClose={() => setIsOpenComeBackLaterDialog(false)}
            open={isOpenComeBackLaterDialog}
        >
            <DialogTitle>
                {"Вы уверены, что хотите сдаться?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Вы уже не сможете вернуться к этому вопросу позже.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary"
                        onClick={saveProgress}
                >
                    Сдаться
                </Button>
                <Button onClick={() => setIsOpenComeBackLaterDialog(false)}>Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}
