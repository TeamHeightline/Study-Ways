import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {saveDetailStatisticThunk} from "../../redux-store/AsyncActions";
import {RootState, useAppSelector} from "../../../../../root-redux-store/RootStore";

interface IUiComebackLaterDialogProps extends PaperProps {
    isOpenComeBackLaterDialog: boolean,
    setIsOpenComeBackLaterDialog: any
}

export default function UiComebackLaterDialog({
                                                  isOpenComeBackLaterDialog,
                                                  setIsOpenComeBackLaterDialog,
                                                  ...props
                                              }: IUiComebackLaterDialogProps) {
    const store = useSelector((state: RootState) => state?.examPlayer)
    const remaining_attempts = useAppSelector(state => state.examPlayer?.remaining_attempts)
    const is_enable_max_question_attempts = useAppSelector(state => state.examPlayer?.exam_data?.is_enable_max_question_attempts)
    const remaining_minutes = useAppSelector(state => state.examPlayer?.remaining_minutes)

    const dispatch: any = useDispatch();


    function saveProgress() {
        dispatch(saveDetailStatisticThunk(store))
    }

    useEffect(() => {
        if (remaining_attempts === 0 && is_enable_max_question_attempts) {
            saveProgress()
        }
    }, [remaining_attempts])
    
    useEffect(() => {
        if (remaining_minutes < 0) {
            saveProgress()
        }
    }, [remaining_minutes])

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
