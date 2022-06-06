import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IQuestionPlayerProps extends PaperProps {

}

export default function QuestionPlayer({...props}: IQuestionPlayerProps) {
    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
}
