import {Alert, CircularProgress, Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {loadQuestionDataAsync} from "../../redux-store/async-actions";
import UIQuestion from "./ui-question";
import UIAnswers from "./ui-answers";
import UIHelpText from "./ui-help-text";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import {createDetailStatistic} from "../../../../../../ServerLayer/QueryLayer/detail-statistic.query";
import {UserStorage} from "../../../../../../Store/UserStore/UserStore";

interface IQuestionPlayerProps extends PaperProps {

}

export default function QuestionPlayer({...props}: IQuestionPlayerProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_id)
    const loading_question_data = useSelector((state: RootState) => state?.ExamByUIDReducer?.loading_selected_question_data)
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
        if (isQuestionPassed && store?.statistic && store?.max_sum_of_points) {
            createDetailStatistic({
                question_id: Number(selectedQuestionID),
                user_name: UserStorage.username,
                is_login: true,
                question_has_been_completed: true,
                statistic: store.statistic,
                is_useExamMode: true,
                max_sum_of_answers_point: store.max_sum_of_points,
                question_sequence_id: undefined
            })

        }
    }, [isQuestionPassed])

    if (loading_question_data) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    if (isQuestionPassed) {
        return (
            <Alert variant={"filled"} severity={"success"}>
                Вопрос пройден
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
