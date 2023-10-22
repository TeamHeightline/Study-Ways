import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {CircularProgress, Divider, Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";
import UIPageTitle from "./ui-page-title";
import UIDuration from "./ui-duration";
import SelectedQSByData from "./ui-seleced-qs-by-data";
import UIExamUrls from "./ui-exam-urls";
import {useSelector} from "react-redux";
import {loadExamDataThunk} from "../redux-store/async-actions";
import AutoSaveModule from "./auto-save-module";
import ExamResultsByID from "../../../ExamResultsByID/UI/exam-results-by-id";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import UIAccessModeSelector from "./ui-access-mode-selector";
import UIIsEnableHelpText from "./ui-is-enable-help-text";
import UIHelpTextLevel from "./ui-help-text-level";
import UIIsEnablePasswordCheck from "./ui-is-enable-password-check";
import UIPassword from "./ui-password";
import UIMaxAttemptsForQuestions from "./ui-max-attempts-for-questions";
import UIIsEnableStartAndFinishTime from "./ui-is-enable-start-and-finish-time";
import UIStartAndFinishTime from "./ui-start-and-finish-time";
import UIIsEnableMaxQuestionAttempts from "./ui-is-enable-max-question-attempts";


interface IExamByIDProps extends PaperProps {
    exam_id: number;
}

const ExamByID = observer(({exam_id, ...props}: IExamByIDProps) => {
    const loadedExamDataID = useSelector((state: RootState) => state?.examEditor?.exam_data?.id)
    const dispatch = useAppDispatch()
    const isMobile = isMobileHook()

    useEffect(() => {
        dispatch(loadExamDataThunk(String(exam_id)))
    }, [exam_id])


    if (Number(loadedExamDataID) !== Number(exam_id)) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} {...props} sx={{pt: 2, pl: isMobile ? 0 : 2}}>
            <AutoSaveModule/>
            <UIPageTitle/>
            <GoBackButton/>
            <Stack direction={isMobile ? "column" : "row"} spacing={1} sx={{pb: 2}}>
                <Stack direction={"column"} spacing={1} width={isMobile ? "100%" : 400}>
                    <div>
                        <Divider>Настройки</Divider>
                    </div>
                    <ExamName sx={{pt: 1}}/>
                    <UIDuration sx={{pt: 2}}/>
                    {/*<UIQuestionSequenceSelector sx={{pt: 2}}/>*/}
                    <SelectedQSByData/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={"column"} spacing={1} width={isMobile ? "100%" : 400}>
                    <div>
                        <Divider>Сложность </Divider>
                    </div>
                    <UIIsEnableHelpText/>
                    <UIHelpTextLevel/>
                    <UIIsEnableMaxQuestionAttempts/>
                    <UIMaxAttemptsForQuestions/>
                    {/*<UIAccessTypeToggle/>*/}
                    {/*<UIAccessTypeVariants/>*/}
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} width={isMobile ? "100%" : 400}>
                    <div>
                        <Divider>Ограничение доступа</Divider>
                    </div>
                    <UIAccessModeSelector/>
                    <UIIsEnablePasswordCheck/>
                    <UIPassword/>
                    <UIIsEnableStartAndFinishTime/>
                    <UIStartAndFinishTime/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} width={isMobile ? "100%" : 400}>
                    <div>
                        <Divider>Ссылки</Divider>
                    </div>
                    <UIExamUrls/>
                </Stack>

            </Stack>
            <Divider>Статистика</Divider>
            {exam_id &&
                <ExamResultsByID exam_id={Number(exam_id)}/>}
        </Paper>
    )
})

export default ExamByID
