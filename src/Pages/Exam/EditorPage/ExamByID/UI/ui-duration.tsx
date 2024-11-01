import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../../../App/ReduxStore/RootStore";
import {changeExamMinutes} from "../redux-store/examEditorSlice";


interface IUIDurationProps extends PaperProps {

}

const UIDuration = observer(({...props}: IUIDurationProps) => {
    const examDuration = useSelector((state: RootState) => state?.examEditor?.exam_data?.minutes)
    const dispatch = useAppDispatch()
    const minutes = Math.floor((Number(examDuration) || 0) % 60)
    const hours = Math.floor((Number(examDuration) || 0) / 60)
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
                        onChange={(e) => {
                            dispatch(changeExamMinutes(Number(e.target.value) * 60 + minutes))
                        }}
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
                        onChange={(e) => {
                            dispatch(changeExamMinutes(Number(e.target.value) + hours * 60))
                        }}
                    >
                        {[...Array(60).keys()].map(i => <MenuItem value={i} key={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>
            </Stack>
        </Paper>
    )
})

export default UIDuration
