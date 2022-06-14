import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import UIExamSelector from "./ui-exam-selector";

interface IExamEditorPageProps extends PaperProps {

}

export default function ExamEditorPage({...props}: IExamEditorPageProps) {
    return (
        <Paper elevation={0} {...props}>
            <UIExamSelector/>
        </Paper>
    )
}
