import {CircularProgress, Paper, Stack} from "@mui/material";
import {useEffect} from "react";
import {loadExamDataThunk, openExamPageThunk} from "../redux-store/AsyncActions";
import UIExamName from "./ui-exam-name";
import UIExamQuestionProgress from "./mini-question-selector/ui-exam-questions-progress";
import QuestionPlayer from "./question-player/question-player";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {useParams} from "react-router-dom";


export default function ExamByUIDPge({...props}) {
    const isMobile = isMobileHook()
    const dispatch = useAppDispatch();
    const {uid} = useParams()

    useEffect(() => {
        if (UserStorage.isLogin && uid) {
            dispatch(openExamPageThunk(uid))
            dispatch(loadExamDataThunk(uid))
        }
    }, [uid, UserStorage.isLogin])
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
