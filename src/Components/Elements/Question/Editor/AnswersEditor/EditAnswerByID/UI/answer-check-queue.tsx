import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormHelperText, InputLabel} from "@mui/material";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerCheckQueueProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerCheckQueue = observer(({answer_object, ...props}: IAnswerCheckQueueProps) => {
    return (
        <FormControl fullWidth sx={{maxWidth: 250}}>
            <InputLabel htmlFor="formatted-text-mask-input">Очередь проверки</InputLabel>
            <Input
                value={answer_object.getField("checkQueue")}
                onChange={answer_object.changeCheckQueue}
            />
            <FormHelperText>Чем меньше число, тем выше приоритет</FormHelperText>
        </FormControl>
    )
})

export default AnswerCheckQueue