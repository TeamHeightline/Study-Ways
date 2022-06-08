import {CircularProgress, Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {loadQuestionDataAsync} from "../../redux-store/async-actions";
import UIQuestion from "./ui-question";
import UIAnswers from "./ui-answers";

interface IQuestionPlayerProps extends PaperProps {

}

export default function QuestionPlayer({...props}: IQuestionPlayerProps) {
    const selectedQuestionID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_id)
    const loading_question_data = useSelector((state: RootState) => state?.ExamByUIDReducer?.loading_selected_question_data)
    const dispatch: any = useDispatch();
    useEffect(() => {
        if (selectedQuestionID) {
            dispatch(loadQuestionDataAsync(selectedQuestionID))
        }
    }, [selectedQuestionID])
    if (loading_question_data) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} {...props} sx={{mt: 2}}>
            <UIQuestion/>
            <UIAnswers/>
        </Paper>
    )
}
