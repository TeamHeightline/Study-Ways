import {observer} from "mobx-react";
import {Box, Stack} from "@mui/material";
import {Author} from "./author";
import {Courses} from "./courses";
import {Cards} from "./cards";

export const AuthorPage = observer(() => {
    return (
        <Stack direction={'column'} sx={{p: 2}} spacing={2}>
            <Author/>
            <Courses/>
            <Cards/>
        </Stack>
    )
})