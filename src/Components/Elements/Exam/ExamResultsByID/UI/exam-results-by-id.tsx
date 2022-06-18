import {Paper, Table} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadExamResultsAsync} from "../redux-store/async-actions";
import UiExamTableHead from "./ui-exam-table-head";
import UIExamsResultsTableBody from "./ui-exam-resuls-table-body";
import UIAutoUpdateFlag from "./ui-auto-update-flag";
import {RootState} from "../../../../../root-redux-store/RootReducer";
import {changeExamID, createArrayForChart} from "../redux-store/actions";
import UIExamFinalResultChart from "./ui-exam-final-result-chart";

interface IExamResultsByIDProps extends PaperProps {
    exam_id: number;
}

export default function ExamResultsByID({exam_id, ...props}: IExamResultsByIDProps) {
    const dispatch: any = useDispatch();
    const examID = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_id)
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)

    useEffect(() => {
        if (examID !== exam_id) {
            dispatch(changeExamID(exam_id));
        }
    }, [exam_id])

    useEffect(() => {
        if (examID) {
            dispatch(loadExamResultsAsync(examID));
        }
    }, [examID]);

    useEffect(() => {
        dispatch(createArrayForChart())
    }, [examResults])
    return (
        <Paper elevation={0} {...props}>
            <UIExamFinalResultChart/>
            <UIAutoUpdateFlag/>
            <Table>
                <UiExamTableHead/>
                <UIExamsResultsTableBody/>
            </Table>
        </Paper>
    )
}
