import {Box, IconButton, Stack, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {RootState, useAppDispatch} from "../../../../../App/ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {changeOrderingByCreatedAt} from "../redux-store/QuestionEditorPageSlice";

interface IUIOrderingByCreatedAtProps extends BoxProps {

}


export default function UIOrderingByCreatedAt({...props}: IUIOrderingByCreatedAtProps) {
    const ordering_by_created_at = useSelector((state: RootState) => state?.questionEditorPage?.ordering_by_created_at)
    const dispatch = useAppDispatch()
    return (
        <Box {...props}>
            <Stack direction={"row"} alignItems={"center"}>
                <IconButton size={"small"} onClick={() => dispatch(changeOrderingByCreatedAt())}>
                    {ordering_by_created_at === 'asc' ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                </IconButton>
                <Typography variant={"body2"}>
                    Сортировать по дате создания
                </Typography>
            </Stack>
        </Box>
    )
}
