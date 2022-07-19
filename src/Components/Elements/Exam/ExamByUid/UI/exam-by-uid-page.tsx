import {CircularProgress, Paper, Stack} from "@mui/material";
import {useEffect} from "react";
import {loadExamNameThunk, openExamPageThunk} from "../redux-store/AsyncActions";
import UIExamName from "./ui-exam-name";
import UIExamQuestionProgress from "./mini-question-selector/ui-exam-questions-progress";
import QuestionPlayer from "./question-player/question-player";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {useAppDispatch} from "../../../../../root-redux-store/RootStore";


export default function ExamByUIDPge({...props}) {
    const isMobile = isMobileHook()
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (UserStorage.isLogin) {
            dispatch(openExamPageThunk(props.match.params.uid))
            dispatch(loadExamNameThunk(props.match.params.uid))
        }
    }, [props.match.params.uid, UserStorage.isLogin])
    if (!UserStorage.isLogin) {
        return (
            <Stack alignItems="center">
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} {...props} sx={{p: isMobile ? 0 : 2}}>
            <UIExamName/>
            <UIExamQuestionProgress/>
            <QuestionPlayer/>
        </Paper>
    )
}
