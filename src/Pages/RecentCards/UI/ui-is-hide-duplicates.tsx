import {Box, Checkbox, FormControlLabel, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {useAppDispatch, useAppSelector} from "../../../root-redux-store/RootStore";
import {setIsHideDuplicates} from "../Store/recent-card-slice";

interface IUIIsHideDuplicatesProps extends BoxProps {

}

export default function UIIsHideDuplicates({...props}: IUIIsHideDuplicatesProps) {
    const dispatch = useAppDispatch()

    const is_hide_duplicates = useAppSelector(state => state.recentCards.is_hide_duplicates)

    const changeIsHideDuplicates = (e) => {
        dispatch(setIsHideDuplicates(e.target.checked))
    }

    return (
        <Box {...props}>
            <Stack alignItems={"end"}>
                <FormControlLabel control={<Checkbox checked={is_hide_duplicates} onChange={changeIsHideDuplicates}/>}
                                  label="Скрыть повторяющиеся карточки"/>
            </Stack>
        </Box>
    )
}
