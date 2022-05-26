import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormControl, InputLabel, MenuItem, Paper, Select, Stack} from "@mui/material";


interface IUIDurationProps extends PaperProps {

}

const UIDuration = observer(({...props}: IUIDurationProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"row"} spacing={1} maxWidth={300}>
                <FormControl fullWidth>
                    <InputLabel>Часы</InputLabel>
                    <Select
                        id="select-exam-hours"
                        label="Часы"
                    >
                        {[...Array(4).keys()].map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Минуты</InputLabel>
                    <Select
                        id="select-exam-minutes"
                        label="Минуты"
                    >
                        {[...Array(60).keys()].map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
        </Paper>
    )
})

export default UIDuration
