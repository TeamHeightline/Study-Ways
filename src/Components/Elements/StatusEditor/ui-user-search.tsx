import {Button, Grid, Paper, Stack, TextField} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {changeSearchText, searchUsers} from "../../../redux-store/user-status-editor/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux-store/RootReducer";

interface IUIUserSearchProps extends PaperProps {

}

export default function UIUserSearch({...props}: IUIUserSearchProps) {
    const searchText = useSelector((state: RootState) => state.statusEditorReducer.search_text)
    const dispatch = useDispatch()

    function changeSearchTextHandle(event) {
        dispatch(changeSearchText(event.target.value))
    }

    function searchUsersHandle() {
        dispatch(searchUsers())
    }

    return (
        <Paper elevation={0} {...props}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Stack direction={"row"} spacing={2}>
                        <TextField
                            value={searchText}
                            onChange={changeSearchTextHandle}
                            fullWidth
                            id="user_search"
                            label="Поиск по имени фамилии и email"
                            variant="outlined"/>
                        <Button
                            onClick={searchUsersHandle}
                            variant={"outlined"}>
                            Поиск
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}
