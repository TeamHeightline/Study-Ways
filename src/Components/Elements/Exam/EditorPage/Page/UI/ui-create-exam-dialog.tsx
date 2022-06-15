import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {changeExamNameForCreate, closeDialogAndClearCreateData} from "../redux-store/actions";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import UIQuestionSequenceSelector from "./ui-question-sequence-selector";
import {createExamAsync} from "../redux-store/async-actions";
import {useHistory} from "react-router-dom";
import {LoadingButton} from "@mui/lab";

interface IUICreateExamDialogProps extends PaperProps {

}

export default function UICreateExamDialog({...props}: IUICreateExamDialogProps) {
    const isOpenCreateExamDialog = useSelector((state: RootState) => state?.examEditorPageReducer?.is_open_create_exam_dialog)
    const examName = useSelector((state: RootState) => state?.examEditorPageReducer?.exam_name_for_create)
    const examQSID = useSelector((state: RootState) => state?.examEditorPageReducer?.exam_qs_id_for_create)
    const pendingExamCreation = useSelector((state: RootState) => state?.examEditorPageReducer?.create_exam_pending)
    const dispatch: any = useDispatch();
    const history = useHistory();

    function examNameHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeExamNameForCreate(event.target.value))
    }

    function redirectCallBackFn(examID: number) {
        history.push("/editor/exam/select/" + examID)
    }

    function createExamHandler() {
        dispatch(createExamAsync(String(examName), Number(examQSID), redirectCallBackFn))
    }

    function closeCreateExamDialog() {
        dispatch(closeDialogAndClearCreateData())
    }


    return (
        <Dialog open={!!isOpenCreateExamDialog} onClose={closeCreateExamDialog}>
            <DialogTitle>Создание экзамена</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Введите название и выберите серию вопросов для будущего экзамена,
                    затем нажмите кнопку СОЗДАТЬ
                </DialogContentText>
                <TextField
                    value={examName}
                    onChange={examNameHandler}
                    autoFocus
                    margin="dense"
                    id="exam_name"
                    label="Название экзамена"
                    fullWidth
                    variant="standard"
                />
                <UIQuestionSequenceSelector/>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCreateExamDialog}
                        startIcon={<CloseIcon/>}
                        color={"secondary"}>
                    Отмена
                </Button>
                <LoadingButton onClick={createExamHandler}
                               loading={pendingExamCreation}
                               disabled={!examName || !examQSID}
                               startIcon={<AddIcon/>}
                               color={"primary"}>
                    Создать
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}
