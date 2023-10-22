import {Box, Checkbox, FormControlLabel} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import {changeShowOnlyFilledQuestions} from "../redux-store/QuestionEditorPageSlice";

interface IHideNotFilledQuestionsProps extends BoxProps {

}


export default function HideNotFilledQuestions({...props}: IHideNotFilledQuestionsProps) {
    const show_only_filled_questions = useSelector((state: RootState) => state?.questionEditorPage?.show_only_filled_questions)
    const dispatch = useAppDispatch()
    return (
        <Box {...props}>
            <FormControlLabel control={
                <Checkbox
                    sx={{ml: 1}}
                    checked={show_only_filled_questions}
                    onChange={() => {
                        dispatch(changeShowOnlyFilledQuestions())
                    }}
                />
            } label="Показать только заполненные"/>
        </Box>
    )
}
