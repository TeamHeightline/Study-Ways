import {Box, TextField} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {useState} from "react";

interface IUIStartAndFinishTimeProps extends BoxProps {

}

export default function UIStartAndFinishTime({...props}: IUIStartAndFinishTimeProps) {
    const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <Box {...props}>
            <DateTimePicker
                label="Начало"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
            />
            <Box sx={{mt: 1}}>
                <DateTimePicker
                    label="Конец"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>

        </Box>
    )
}
