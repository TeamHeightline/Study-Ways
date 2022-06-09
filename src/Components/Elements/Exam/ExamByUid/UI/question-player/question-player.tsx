import {Alert, CircularProgress, Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {loadQuestionDataAsync, saveDetailStatisticAsync} from "../../redux-store/async-actions";
import UIQuestion from "./ui-question";
import UIAnswers from "./ui-answers";
import UIHelpText from "./ui-help-text";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";

interface IQuestionPlayerProps extends PaperProps {

}

export default function QuestionPlayer({...props}: IQuestionPlayerProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_id)
    const loading_question_data = useSelector((state: RootState) => state?.ExamByUIDReducer?.loading_selected_question_data)
    const await_statistic_save = useSelector((state: RootState) => state?.ExamByUIDReducer?.await_statistic_save)
    const isQuestionPassed = useSelector((state: RootState) => state?.ExamByUIDReducer?.is_question_completed)
    const store = useSelector((state: RootState) => state?.ExamByUIDReducer)
    const dispatch: any = useDispatch();
    const isMobile = isMobileHook()

    useEffect(() => {
        if (selectedQuestionID) {
            dispatch(loadQuestionDataAsync(selectedQuestionID))
        }
    }, [selectedQuestionID])

    useEffect(() => {
        if (isQuestionPassed) {
            dispatch(saveDetailStatisticAsync(store))
        }
    }, [isQuestionPassed])

    if (loading_question_data || await_statistic_save) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    if (selectedQuestionID == null) {
        return (
            <Alert variant={"filled"} severity={"success"}>
                Экзамен завершен, вы прошли все вопросы
            </Alert>
        )
    }
    return (
        <Paper elevation={0} {...props} sx={{mt: 2}}>
            {!isMobile && <UIHelpText/>}
            <UIQuestion/>
            {isMobile && <UIHelpText/>}
            <UIAnswers/>
        </Paper>
    )
}
