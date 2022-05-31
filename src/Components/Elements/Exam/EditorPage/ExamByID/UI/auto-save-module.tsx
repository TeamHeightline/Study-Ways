import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useEffect} from "react";

interface IAutoSaveModuleProps extends PaperProps {

}

let updateTimer: any = null
export default function AutoSaveModule({...props}: IAutoSaveModuleProps) {
    const dispatch: any = useDispatch()
    const examData = useSelector((state: RootState) => state.examEditorReducer.exam_data)

    useEffect(() => {
        console.log("updateExam -- ------------------")
        clearTimeout(updateTimer)
        updateTimer = setTimeout(() => updateExam(), 2000)
    }, [examData])

    function updateExam() {
        console.log("updateExam -->")
    }

    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
}
