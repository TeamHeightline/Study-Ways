import {Paper, Stack, TextField} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {DateTimePicker} from "@mui/lab";
import {useState} from "react";

interface IUITimeIntervalProps extends PaperProps {

}

export default function UITimeInterval({...props}: IUITimeIntervalProps) {
    const [time, setTime] = useState<Date | null>(null);
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"row"} spacing={1}>
                <DateTimePicker
                    label="C"
                    value={time}
                    onChange={(newValue) => {
                        setTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                    label="По"
                    value={time}
                    onChange={(newValue) => {
                        setTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
        </Paper>
    )
}
