import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Dialog} from "@mui/material";
import {Sequences} from "../../../../QuestionSequence/Selector/UI/Sequences";
import {useDispatch, useSelector} from "react-redux";
import {loadQSData} from "../redux-store/async-actions";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import {changeExamQSIDForCreate} from "../redux-store/actions";
import SelectedQSByData from "./ui-seleced-qs-by-data";


interface IUIQuestionSequenceSelectorProps extends PaperProps {

}

export default function UIQuestionSequenceSelector({...props}: IUIQuestionSequenceSelectorProps) {
    //переменная для хранения ID выбранной серии вопросов
    const selectedQSID = useSelector((state: RootState) => state?.examEditorPageReducer?.exam_qs_id_for_create)

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
        dispatch(changeExamQSIDForCreate(id))
        handleClose()
    }

    return (
        <>
            <Button variant={"outlined"} color={"primary"} onClick={handleOpen} sx={{mt: 1}}>
                Выбрать серию вопросов
            </Button>

            <SelectedQSByData sx={{mt: 1}}/>

            <Dialog fullScreen open={open} onClose={handleClose}>
                <Sequences onSelectQS={updateSelectedQuestionSequenceID}/>
            </Dialog>
        </>
    )
}
