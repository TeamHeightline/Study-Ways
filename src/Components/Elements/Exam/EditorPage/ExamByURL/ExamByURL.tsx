import {Paper} from "@mui/material";
import {RouteComponentProps} from "react-router-dom";
import ExamByID from "../ExamByID/UI/exam-by-id-page";

interface routeProps {
    examID: string
}

interface IExamEditorByURLProps extends RouteComponentProps<routeProps> {

}

export default function ExamEditorByURL({...props}: IExamEditorByURLProps) {
    const examID = props.match.params.examID
    if (!examID) {
        return <div/>
    }
    return (
        <Paper elevation={0} {...props}>
            <ExamByID exam_id={Number(examID)}/>
        </Paper>
    )
}
