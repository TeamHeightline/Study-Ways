import {Paper} from "@mui/material";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadExamNameAsync, openExamPageAsync} from "../redux-store/async-actions";
import UIExamName from "./ui-exam-name";
import UIExamQuestionProgress from "./mini-question-selector/ui-exam-questions-progress";
import QuestionPlayer from "./question-player/question-player";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";


export default function ExamByUIDPge({...props}) {
    const isMobile = isMobileHook()
    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(openExamPageAsync(props.match.params.uid))
        dispatch(loadExamNameAsync(props.match.params.uid))
    }, [props.match.params.uid])
    return (
        <Paper elevation={0} {...props} sx={{p: isMobile ? 0 : 2}}>
            <UIExamName/>
            <UIExamQuestionProgress/>
            <QuestionPlayer/>
        </Paper>
    )
}
