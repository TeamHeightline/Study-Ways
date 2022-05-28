import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Dialog, Paper} from "@mui/material";
import {Sequences} from "../../../../QuestionSequence/Selector/UI/Sequences";
import {useDispatch, useSelector} from "react-redux";
import {changeExamEditorSelectedQsId} from "../../../../../../redux-store/exam-editor/actions";
import {loadQSData} from "../../../../../../redux-store/exam-editor/async-actions";
import {RootState} from "../../../../../../redux-store/RootReducer";


interface IUIQuestionSequenceSelectorProps extends PaperProps {

}

const UIQuestionSequenceSelector = observer(({...props}: IUIQuestionSequenceSelectorProps) => {
    //переменная для хранения ID выбранной серии вопросов
    const selectedQSID = useSelector((state: RootState) => state.examEditorReducer.exam_data.question_sequence_id)

    const [open, setOpen] = React.useState(false);
    const dispatch: any = useDispatch()

    useEffect(() => {
        if (selectedQSID) {
            dispatch(loadQSData(String(selectedQSID)))
        }
    }, [selectedQSID])

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
        dispatch(changeExamEditorSelectedQsId(String(id)))
        handleClose()
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
