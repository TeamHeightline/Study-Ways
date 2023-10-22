import {Button, Grid, Paper, Stack, TextField} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import {changeSearchString} from "../redux-store/StatusEditorSlice";
import {loadAllUsersAsync, searchUserAsync} from "../redux-store/AsyncActions";
import {RootState, useAppDispatch} from "../../../root-redux-store/RootStore";
import SearchIcon from '@mui/icons-material/Search';

interface IUIUserSearchProps extends PaperProps {

}

export default function UIUserSearch({...props}: IUIUserSearchProps) {
    const searchText = useSelector((state: RootState) => state.statusEditor.searchString);
    const dispatch = useAppDispatch()

    function changeSearchTextHandle(event) {
        dispatch(changeSearchString(event.target.value))
    }

    function searchUsersHandle() {
        if (searchText.length > 0) {
            dispatch(searchUserAsync(searchText))
        } else {
            dispatch(loadAllUsersAsync())
        }
    }

    return (
        <Paper elevation={0} {...props}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Stack direction={"row"} spacing={1}>
                        <TextField
                            value={searchText}
                            onChange={changeSearchTextHandle}
                            fullWidth
                            id="user_search"
                            label="Поиск по имени фамилии и email"
                            variant="outlined"/>
                        <Button
                            onClick={searchUsersHandle}
                            variant={"outlined"}
                            startIcon={<SearchIcon/>}
                        >
                            Поиск
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}
