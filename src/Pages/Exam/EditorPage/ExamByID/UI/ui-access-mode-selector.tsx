import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {RootState, useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {useSelector} from "react-redux";
import {changeAccessMode} from "../redux-store/examEditorSlice";

interface IUIAccessModeSelectorProps extends BoxProps {

}


export default function UIAccessModeSelector({...props}: IUIAccessModeSelectorProps) {
    const dispatch = useAppDispatch()
    const accessMode = useSelector((state: RootState) => state?.examEditor?.exam_data?.access_mode)
    return (
        <Box {...props}>
            <FormControl fullWidth>
                <InputLabel>Тип доступа</InputLabel>
                <Select
                    label="Тип доступа"
                    value={accessMode || "open"}
                    onChange={(e) => {
                        const newValue = e.target.value as typeof accessMode
                        if (newValue) {
                            dispatch(changeAccessMode(newValue))
                        }
                    }}
                >

                    <MenuItem value={"open"}>
                        <CheckIcon sx={{mr: 2}} fontSize="small"/>
                        Открытый
                    </MenuItem>

                    <MenuItem value={"closed"}>
                        <CloseIcon sx={{mr: 2}} fontSize="small"/>
                        Закрытый
                    </MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}
