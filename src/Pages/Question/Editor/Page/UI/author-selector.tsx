import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import {useSelector} from "react-redux";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";
import {changeAuthorFilter} from "../redux-store/QuestionEditorPageSlice";

export default function AuthorSelector() {
    const dispatch = useAppDispatch()
    const authors = useSelector((state: RootState) => state?.questionEditorPage?.authors)
    const author_filter = useSelector((state: RootState) => state?.questionEditorPage?.author_filter)

    function handleChange(event: SelectChangeEvent) {
        dispatch(changeAuthorFilter(event.target.value))
    }

    if (UserStorage.userAccessLevel !== "ADMIN") {
        return null
    }

    // MIO Selector
    return (
        <FormControl fullWidth sx={{maxWidth: 316}}>
            <InputLabel>Автор</InputLabel>
            <Select
                value={String(author_filter)}
                label="Автор"
                onChange={handleChange}
            >
                <MenuItem value={"my"}>Мои</MenuItem>
                <MenuItem value={"all"}>Все</MenuItem>
                <Divider/>
                {authors?.map((author) =>
                    <MenuItem key={author.id}
                              value={String(author.id)}>
                        {author?.users_userprofile?.lastname
                            + " " +
                            author?.users_userprofile?.firstname
                            + " (" +
                            author?.username
                            + ")"}
                    </MenuItem>
                )}
            </Select>
        </FormControl>

    )

}