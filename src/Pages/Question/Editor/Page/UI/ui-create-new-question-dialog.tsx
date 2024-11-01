import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {RootState, useAppDispatch} from "../../../../../App/ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {
    closeCreateQuestionDialog,
    finishCreatingNewQuestion,
    startCreatingNewQuestion
} from "../redux-store/QuestionEditorPageSlice";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import {LoadingButton} from "@mui/lab";
import {QuestionEditorStorage} from "../../QuestionEditor/Store/QuestionEditorStorage";
import {useNavigate} from "react-router-dom";

interface IUICreateNewQuestionDialogProps extends BoxProps {

}


export default function UICreateNewQuestionDialog({...props}: IUICreateNewQuestionDialogProps) {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const is_open_create_question_dialog = useSelector((state: RootState) => state?.questionEditorPage?.is_open_create_question_dialog)
    const is_new_question_now_creating = useSelector((state: RootState) => state?.questionEditorPage?.is_new_question_now_creating)


    const handleClose = () => {
        dispatch(closeCreateQuestionDialog())
    }

    async function createNewQuestion() {
        dispatch(startCreatingNewQuestion())
        const questionID = await QuestionEditorStorage.createNewQuestion()
        dispatch(finishCreatingNewQuestion())
        handleClose()
        navigate('selected/' + questionID)
    }

    return (
        <Box {...props}>
            <Dialog
                open={is_open_create_question_dialog}
                onClose={handleClose}
            >
                <DialogTitle>
                    {"Создать новый вопрос?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверенны, что хотите создать новый вопрос? Если вы нажмете ОК, то вы перейдете на страницу
                        редактирования нового вопроса.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={"error"} endIcon={<CloseIcon/>}>
                        Отмена
                    </Button>
                    <LoadingButton
                        loading={is_new_question_now_creating}
                        onClick={createNewQuestion}
                        endIcon={<AddIcon/>}>
                        Создать
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
