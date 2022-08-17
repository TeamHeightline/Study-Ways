import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {RootState, useAppDispatch} from "../../../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import {changeHelpTextLevel} from "../redux-store/examEditorSlice";

interface IUIHelpTextLevelProps extends BoxProps {

}

export default function UIHelpTextLevel({...props}: IUIHelpTextLevelProps) {
    const dispatch = useAppDispatch()
    const help_text_level = useSelector((state: RootState) => state?.examEditor?.exam_data?.help_text_level) || 0;
    const is_enable_help_text = useSelector((state: RootState) => state?.examEditor?.exam_data?.is_enable_help_text) || false;
    return (
        <Box {...props}>
            <FormControl
                fullWidth>
                <InputLabel>Уровень подсказки</InputLabel>
                <Select
                    label="Уровень подсказки"
                    value={help_text_level}
                    onChange={(event) => {
                        if (event.target.value == 0 || event.target.value == 1 || event.target.value == 2) {
                            dispatch(changeHelpTextLevel(event.target.value))
                        }
                    }}
                    disabled={!is_enable_help_text}
                >
                    <MenuItem value={0}>Легкий</MenuItem>
                    <MenuItem value={1}>Нормальный</MenuItem>
                    <MenuItem value={2}>Усложненный</MenuItem>
                </Select>
            </FormControl>

        </Box>
    )
}
