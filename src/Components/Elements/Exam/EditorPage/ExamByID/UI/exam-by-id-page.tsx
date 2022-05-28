import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {CircularProgress, Divider, Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";
import UIPageTitle from "./ui-page-title";
import UIDuration from "./ui-duration";
import UIQuestionSequenceSelector from "./ui-question-sequence-selector";
import SelectedQSByData from "./ui-seleced-qs-by-data";
import UIAccessTypeToggle from "./ui-access-type-togle";
import UIAccessTypeVariants from "./ui-access-type-variants";
import UIStudentsAccessType from "./ui-students-access-type";
import UIExamUrls from "./ui-exam-urls";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useDispatch, useSelector} from "react-redux";
import {loadExamData} from "../../../../../../redux-store/exam-editor/async-actions";
import {changeExamID} from "../../../../../../redux-store/exam-editor/actions";


interface IExamByIDProps extends PaperProps {
    exam_id?: number;
}

const ExamByID = observer(({exam_id = 1, ...props}: IExamByIDProps) => {
    const storeExamID = useSelector((state: RootState) => state.examEditorReducer.exam_id)
    const isLoadingEdamData = useSelector((state: RootState) => state.examEditorReducer.exam_data_loading)
    const dispatch: any = useDispatch()

    useEffect(() => {
        dispatch(changeExamID(String(exam_id)))
    }, [exam_id])

    useEffect(() => {
        if (storeExamID) {
            dispatch(loadExamData(storeExamID))
        }
    }, [storeExamID])


    if (isLoadingEdamData) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <UIPageTitle/>
            <GoBackButton/>
            <Stack direction={"row"} spacing={1} sx={{pb: 2}}>
                <Stack direction={"column"} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Настройки</Divider>
                    </div>
                    <ExamName sx={{pt: 1}}/>
                    <UIDuration/>
                    <UIQuestionSequenceSelector/>
                    <SelectedQSByData/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={"column"} spacing={1} width={400}>
                    <div>
                        <Divider>Проводится в </Divider>
                    </div>
                    <UIAccessTypeToggle/>
                    <UIAccessTypeVariants/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Допуск к экзамену</Divider>
                    </div>
                    <UIStudentsAccessType/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Ссылки</Divider>
                    </div>
                    <UIExamUrls/>
                </Stack>

            </Stack>
            <Divider>Статистика</Divider>
        </Paper>
    )
})

export default ExamByID
