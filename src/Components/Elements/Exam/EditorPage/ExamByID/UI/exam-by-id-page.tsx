import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {CircularProgress, Divider, Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";
import UIPageTitle from "./ui-page-title";
import UIDuration from "./ui-duration";
import SelectedQSByData from "./ui-seleced-qs-by-data";
import UIAccessTypeToggle from "./ui-access-type-togle";
import UIAccessTypeVariants from "./ui-access-type-variants";
import UIStudentsAccessType from "./ui-students-access-type";
import UIExamUrls from "./ui-exam-urls";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useDispatch, useSelector} from "react-redux";
import {loadExamData} from "../redux-store/async-actions";
import {changeExamID} from "../redux-store/actions";
import AutoSaveModule from "./auto-save-module";
import ExamResultsByID from "../../../ExamResultsByID/UI/exam-results-by-id";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";


interface IExamByIDProps extends PaperProps {
    exam_id: number;
}

const ExamByID = observer(({exam_id, ...props}: IExamByIDProps) => {
    const storeExamID = useSelector((state: RootState) => state?.examEditorReducer?.exam_id)
    const loadedExamDataID = useSelector((state: RootState) => state?.examEditorReducer?.exam_data?.id)
    const isLoadingEdamData = useSelector((state: RootState) => state?.examEditorReducer?.exam_data_loading)
    const dispatch: any = useDispatch()
    const isMobile = isMobileHook()

    useEffect(() => {
        dispatch(changeExamID(String(exam_id)))
    }, [exam_id])

    useEffect(() => {
        if (storeExamID) {
            dispatch(loadExamData(storeExamID))
        }
    }, [storeExamID])


    if (isLoadingEdamData || Number(loadedExamDataID) !== Number(exam_id)) {
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
                        <Divider>Проводится в </Divider>
                    </div>
                    <UIAccessTypeToggle/>
                    <UIAccessTypeVariants/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} width={isMobile ? "100%" : 400}>
                    <div>
                        <Divider>Допуск к экзамену</Divider>
                    </div>
                    <UIStudentsAccessType/>
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
            {loadedExamDataID &&
                <ExamResultsByID exam_id={Number(loadedExamDataID)}/>}
        </Paper>
    )
})

export default ExamByID
