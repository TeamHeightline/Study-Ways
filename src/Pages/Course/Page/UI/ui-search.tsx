import {Box, IconButton, InputBase, Paper, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import SearchIcon from '@mui/icons-material/Search';
import {useAppDispatch, useAppSelector} from "../../../../App/ReduxStore/RootStore";
import {setSearchString} from "../redux-store/course-page-slice";
import {loadCourseDataThunk} from "../redux-store/async-functions";

interface IUISearchProps extends BoxProps {

}


export default function UISearch({...props}: IUISearchProps) {
    const dispatch = useAppDispatch()
    const search_string = useAppSelector(state => state.coursePage.search_string);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchString(e.target.value))
    }
    const onSearchButtonClick = () => {
        dispatch(loadCourseDataThunk(search_string))
    }


    return (
        <Box {...props}>
            <Stack alignItems={"center"}>
                <Paper
                    component="form"
                    sx={{p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 400, width: "100%"}}
                >
                    <InputBase
                        value={search_string}
                        onChange={handleSearch}
                        sx={{ml: 1, flex: 1}}
                        placeholder="Поиск курсов"
                    />
                    <IconButton type="button" sx={{p: '10px'}} aria-label="search" onClick={onSearchButtonClick}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
            </Stack>
        </Box>
    )
}
