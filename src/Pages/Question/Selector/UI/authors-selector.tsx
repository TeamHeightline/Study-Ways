import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormControl, InputLabel, MenuItem, Paper, Select} from "@mui/material";
import QSSObject from "../Store/question-selector-store";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";


interface IAuthorSelectorProps extends PaperProps {

}

const AuthorSelector = observer(({...props}: IAuthorSelectorProps) => {
    const isMobile = isMobileHook()

    return (
        <Paper elevation={0} {...props} sx={{pl: 3, pt: 2}}>
            <FormControl sx={{minWidth: isMobile ? undefined : 200}}>
                <InputLabel>Автор</InputLabel>
                <Select
                    label="Автор"
                    value={QSSObject.selectedAuthorID}
                    onChange={QSSObject.changeSelectedAuthorID}
                >
                    <MenuItem value={"-2"}>Все вопросы</MenuItem>
                    <MenuItem value={"-1"}>Мои вопросы</MenuItem>
                    {QSSObject.usersWithQuestions.map((user) => {
                        return (
                            <MenuItem
                                value={user.id}
                                key={user.id + "Author"}>
                                {user.username}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Paper>
    )
})

export default AuthorSelector
