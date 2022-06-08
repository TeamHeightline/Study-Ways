import {Card, Grid, Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";
import UIQuestionButtonFactory from "./ui-question-button-factory";

interface IUIExamQuestionProgressProps extends PaperProps {

}

export default function UIExamQuestionProgress({...props}: IUIExamQuestionProgressProps) {
    const questionStatuses = useSelector((state: RootState) => state?.ExamByUIDReducer?.question_statuses)
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
