import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";


interface IUIQSNameProps extends PaperProps{

}

const UIQSName = observer(({...props}: IUIQSNameProps) =>{
    return(
        <Paper elevation={0} {...props}>
            <TextField value={editQSStore.qsData?.name}
                       onChange={editQSStore.changeQSName}
                       size="small"
                       label="Название серии вопросов"
                       variant="outlined"
                       multiline
                       fullWidth
            />
        </Paper>
    )
})

export default UIQSName
