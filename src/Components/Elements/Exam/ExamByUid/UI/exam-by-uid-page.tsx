import {Alert, CircularProgress, Paper, Stack} from "@mui/material";
import {useEffect} from "react";
import {loadExamDataThunk, openExamPageThunk} from "../redux-store/AsyncActions";
import UIExamName from "./ui-exam-name";
import UIExamQuestionProgress from "./mini-question-selector/ui-exam-questions-progress";
import QuestionPlayer from "./question-player/question-player";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {useAppDispatch, useAppSelector} from "../../../../../root-redux-store/RootStore";
import {useParams} from "react-router-dom";
import {observer} from "mobx-react";
import UIAccessPassword from "./ui-access-password";


const ExamByUIDPge = observer(({...props}) => {
    const isMobile = isMobileHook()
    const dispatch = useAppDispatch();
    const {uid} = useParams()
    const access_mode = useAppSelector(state => state.examPlayer?.exam_data?.access_mode)
    const is_enable_password_check = useAppSelector(state => state.examPlayer?.exam_data?.is_enable_password_check)
    const password = useAppSelector(state => state.examPlayer?.exam_data?.password)
    const is_password_check_passed = useAppSelector(state => state.examPlayer?.is_password_check_passed)

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

    if (access_mode === 'closed') {
        return (
            <Alert severity={"info"}>
                Преподаватель еще не открыл доступ для этого экзамена, для новой попытки входа обновите страницу
            </Alert>
        )
    }

    if (is_enable_password_check && password && !is_password_check_passed) {
        return (
            <UIAccessPassword/>
        )
    }


    return (
        <Paper elevation={0} {...props} sx={{p: isMobile ? 0 : 2}}>
            <UIExamName/>
            <UIExamQuestionProgress/>
            <QuestionPlayer/>
        </Paper>
    )
})

export default ExamByUIDPge
