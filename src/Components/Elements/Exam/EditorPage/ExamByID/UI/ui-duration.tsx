import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography} from "@mui/material";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useSelector} from "react-redux";


interface IUIDurationProps extends PaperProps {

}

const UIDuration = observer(({...props}: IUIDurationProps) => {
    const examDuration = useSelector((state: RootState) => state.examEditorReducer.exam_data.minutes)
    const minutes = Math.floor(examDuration % 60)
    const hours = Math.floor(examDuration / 60)
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"row"} spacing={1}>
                <Stack alignItems={"center"}>
                    <Typography textAlign={"center"}>
                        Длительность экзамена
                    </Typography>
                </Stack>
                <FormControl fullWidth>
                    <InputLabel>Часы</InputLabel>
                    <Select
                        value={hours}
                        id="select-exam-hours"
                        label="Часы"
                    >
                        {[...Array(4).keys()].map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Минуты</InputLabel>
                    <Select
                        value={minutes}
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
