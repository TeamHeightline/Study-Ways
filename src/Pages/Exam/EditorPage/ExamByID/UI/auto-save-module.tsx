import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {updateExamThunk} from "../redux-store/async-actions";
import {RootState, useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {prepareForUpdateExamData} from "../redux-store/examEditorSlice";

interface IAutoSaveModuleProps extends PaperProps {

}

let updateTimer: any = null
export default function AutoSaveModule({...props}: IAutoSaveModuleProps) {
    const examData = useSelector((state: RootState) => state?.examEditor?.exam_data)
    const dispatch = useAppDispatch()

    useEffect(() => {
        clearTimeout(updateTimer)
        dispatch(prepareForUpdateExamData())
        updateTimer = setTimeout(() => updateExam(), 2000)
    }, [examData])

    function updateExam() {
        dispatch(updateExamThunk(examData))
    }

    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
}
