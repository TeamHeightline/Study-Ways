import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Dialog, Paper} from "@mui/material";
import {Sequences} from "../../../../QuestionSequence/Selector/UI/Sequences";
import {useDispatch} from "react-redux";
import {changeExamEditorSelectedQsId} from "../../../../../../redux-store/exam-editor/actions";
import {loadQSData} from "../../../../../../redux-store/exam-editor/async-actions";


interface IUIQuestionSequenceSelectorProps extends PaperProps {

}

const UIQuestionSequenceSelector = observer(({...props}: IUIQuestionSequenceSelectorProps) => {
    //переменная для хранения ID выбранной серии вопросов

    const [open, setOpen] = React.useState(false);
    const dispatch: any = useDispatch()

    //функция для закрытия диалогового окна
    const handleClose = () => {
        setOpen(false);
    }
    //Функция для открытия диалогового окна
    const handleOpen = () => {
        setOpen(true);
    }
    //function for update selected question sequence ID in store and close dialog
    const updateSelectedQuestionSequenceID = (id: number) => {
        dispatch(changeExamEditorSelectedQsId(id))
        handleClose()
        dispatch(loadQSData(String(id)))
    }

    return (
        <Paper elevation={0} {...props}>
            {/*Кнопка с текстом Выбрать последовательность вопросов*/}
            <Button variant={"outlined"} color={"primary"} onClick={handleOpen}>
                Выбрать последовательность вопросов
            </Button>

            {/*Диалоговое окно для выбора последовательности вопросов*/}
            <Dialog fullScreen open={open} onClose={handleClose}>
                <Sequences onSelectQS={updateSelectedQuestionSequenceID}/>
            </Dialog>
        </Paper>
    )
})

export default UIQuestionSequenceSelector
