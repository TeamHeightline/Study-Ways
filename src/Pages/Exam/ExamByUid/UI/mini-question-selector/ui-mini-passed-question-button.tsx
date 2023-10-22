import {Chip, Grid} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import DoneIcon from "@mui/icons-material/Done";
import {useDispatch} from "react-redux";

interface IUIMiniPassedQuestionButtonProps extends PaperProps {
    questionIndex: number,
    questionID: number,
}

export default function UIMiniPassedQuestionButton({
                                                       questionIndex,
                                                       questionID,
                                                       ...props
                                                   }: IUIMiniPassedQuestionButtonProps) {
    const dispatch = useDispatch()
    return (
        <Grid item xs={4}>
            <Chip label={"Вопрос " + questionIndex} variant={"outlined"}
                  color={"success"} disabled icon={<DoneIcon/>}/>
        </Grid>
    )
}
