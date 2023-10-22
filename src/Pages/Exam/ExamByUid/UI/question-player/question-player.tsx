import {Alert, CircularProgress, Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {loadQuestionDataThunk, saveDetailStatisticThunk} from "../../redux-store/AsyncActions";
import UIQuestion from "./ui-question";
import UIAnswers from "./ui-answers";
import UIHelpText from "./ui-help-text";
import {RootState} from "../../../../../root-redux-store/RootStore";

interface IQuestionPlayerProps extends PaperProps {

}

export default function QuestionPlayer({...props}: IQuestionPlayerProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.examPlayer?.selected_question_id)
    const loading_question_data = useSelector((state: RootState) => state?.examPlayer?.loading_selected_question_data)
    const await_statistic_save = useSelector((state: RootState) => state?.examPlayer?.await_statistic_save)
    const isQuestionPassed = useSelector((state: RootState) => state?.examPlayer?.is_question_completed)
    const store = useSelector((state: RootState) => state?.examPlayer)
    const dispatch: any = useDispatch();

    useEffect(() => {
        if (selectedQuestionID) {
            dispatch(loadQuestionDataThunk(selectedQuestionID))
        }
    }, [selectedQuestionID])

    useEffect(() => {
        if (isQuestionPassed) {
            dispatch(saveDetailStatisticThunk(store))
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
            <UIQuestion/>
            <UIHelpText/>
            <UIAnswers/>
        </Paper>
    )
}
