import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";


interface IUIQSDescriptionProps extends PaperProps{

}

const UIQSDescription = observer(({...props}: IUIQSDescriptionProps) =>{
    return(
        <Paper elevation={0} {...props}>
            <TextField value={editQSStore.qsData?.description}
                       onChange={editQSStore.changeQSDescription}
                       size="small"
                       label="Описание серии вопросов"
                       variant="outlined"
                       fullWidth
            />
        </Paper>
    )
})

export default UIQSDescription
