import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Dialog, Paper, Typography} from "@mui/material";
import {Sequences} from "../../../../QuestionSequence/Selector/UI/Sequences";


interface IUIQuestionSequenceSelectorProps extends PaperProps {

}

const UIQuestionSequenceSelector = observer(({...props}: IUIQuestionSequenceSelectorProps) => {
    //переменная для хранения ID выбранной серии вопросов
    const [selectedQuestionSequenceID, setSelectedQuestionSequenceID] = React.useState<number | null>(null);

    const [open, setOpen] = React.useState(false);
    //функция для закрытия диалогового окна
    const handleClose = () => {
        setOpen(false);
    }
    //Функция для открытия диалогового окна
    const handleOpen = () => {
        setOpen(true);
    }
    //Функция для закрытия диалогового окна и выбора серии вопросов
    const handleCloseAndSelect = (newSequenceID: number | null) => {
        setOpen(false);
        setSelectedQuestionSequenceID(newSequenceID);
    }
    return (
        <Paper elevation={0} {...props}>
            {/*Кнопка с текстом Выбрать последовательность вопросов*/}
            <Button variant={"outlined"} color={"primary"} onClick={handleOpen}>
                Выбрать последовательность вопросов
            </Button>
            {/*Текст ID выбранной серии вопросов*/}
            <Typography variant={"h6"}>
                ID выбранной серии вопросов: {selectedQuestionSequenceID}
            </Typography>
            {/*Диалоговое окно для выбора последовательности вопросов*/}
            <Dialog fullScreen open={open} onClose={handleClose}>
                <Sequences onSelectQS={handleCloseAndSelect}/>
            </Dialog>
        </Paper>
    )
})

export default UIQuestionSequenceSelector
