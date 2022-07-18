import {Card, Grid, Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import UIQuestionButtonFactory from "./ui-question-button-factory";
import {changeSelectedQuestionId} from "../../redux-store/actions";
import {useEffect} from "react";
import {IQuestionStatus} from "../../redux-store/initial-state";
import {updateQuestionProgress} from "../../../../../../ServerLayer/QueryLayer/exam.query";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIExamQuestionProgressProps extends PaperProps {

}

export default function UIExamQuestionProgress({...props}: IUIExamQuestionProgressProps) {
    const questionStatuses = useSelector((state: RootState) => state?.ExamByUIDReducer?.question_statuses)
    const selectedQuestionID = useSelector((state: RootState) => state?.ExamByUIDReducer?.selected_question_id)
    const dispatch = useDispatch();
    useEffect(() => {
        if (questionStatuses) {
            //сохраняем обновленный статус вопроса
            const updatedQuestionStatuses = questionStatuses.find((questionStatus: IQuestionStatus) =>
                questionStatus.question_id === selectedQuestionID)
            if (updatedQuestionStatuses && !!updatedQuestionStatuses.statistic_id) {
                updateQuestionProgress(updatedQuestionStatuses)
            }
            //Выбираем новый активный вопрос
            let selectedQuestionStatus_: IQuestionStatus | null = null
            for (let i of questionStatuses) {
                if (!i.statistic_id && selectedQuestionStatus_ == null) {
                    selectedQuestionStatus_ = i
                }
            }

            if (selectedQuestionStatus_) {
                dispatch(changeSelectedQuestionId(selectedQuestionStatus_.question_id))
            } else {
                dispatch(changeSelectedQuestionId(null))
            }
        }
    }, [questionStatuses])
    if (!questionStatuses) {
        return <div/>
    }
    return (
        <Paper elevation={0} {...props}>
            <Card variant={"outlined"} sx={{p: 2, maxWidth: 440, mt: 2, zoom: "115%"}}>
                <Grid container spacing={2} justifyContent={"evenly"}>
                    {questionStatuses?.map((questionStatus, index) => {
                        return (<UIQuestionButtonFactory questionIndex={index} questionStatus={questionStatus}/>)
                    })}
                </Grid>
            </Card>
        </Paper>
    )
}
