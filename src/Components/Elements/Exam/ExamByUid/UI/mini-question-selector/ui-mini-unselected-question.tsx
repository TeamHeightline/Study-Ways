import {Chip, Grid} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {useDispatch} from "react-redux";
import {changeSelectedQuestionId} from "../../redux-store/actions";

interface IUIMiniUnselectedQuestionProps extends PaperProps {
    questionIndex: number,
    questionID: number,
}

export default function UIMiniUnselectedQuestion({
                                                     questionIndex,
                                                     questionID,
                                                     ...props
                                                 }: IUIMiniUnselectedQuestionProps) {
    const dispatch = useDispatch()

    return (
        <Grid item xs={4}>
            <Chip label={"Вопрос " + questionIndex} variant={"outlined"}
                  onClick={() => dispatch(changeSelectedQuestionId(questionID))}
                  icon={<RadioButtonUncheckedIcon/>}/>
        </Grid>
    )
}
