import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useEffect} from "react";
import {updateExamAsync} from "../../../../../../redux-store/exam-editor/async-actions";
import {startUpdateExam} from "../../../../../../redux-store/exam-editor/actions";

interface IAutoSaveModuleProps extends PaperProps {

}

let updateTimer: any = null
export default function AutoSaveModule({...props}: IAutoSaveModuleProps) {
    const dispatch: any = useDispatch()
    const examData = useSelector((state: RootState) => state?.examEditorReducer?.exam_data)

    useEffect(() => {
        clearTimeout(updateTimer)
        dispatch(startUpdateExam())
        updateTimer = setTimeout(() => updateExam(), 2000)
    }, [examData])

    function updateExam() {
        dispatch(updateExamAsync(examData))
    }

    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
}
