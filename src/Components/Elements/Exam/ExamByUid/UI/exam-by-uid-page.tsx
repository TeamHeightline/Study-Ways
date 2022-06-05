import {Paper} from "@mui/material";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadExamNameAsync, openExamPageAsync} from "../redux-store/async-actions";
import UIExamName from "./ui-exam-name";
import UIExamQuestionProgress from "./ui-exam-questions-progress";


export default function ExamByUIDPge({...props}) {
    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(openExamPageAsync(props.match.params.uid))
        dispatch(loadExamNameAsync(props.match.params.uid))
    }, [props.match.params.uid])
    return (
        <Paper elevation={0} {...props}>
            <UIExamName/>
            <UIExamQuestionProgress/>
        </Paper>
    )
}
