import {Paper, Table} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {loadExamResultsAsync} from "../redux-store/async-actions";
import UiExamTableHead from "./ui-exam-table-head";
import UIExamsResultsTableBody from "./ui-exam-resuls-table-body";

interface IExamResultsByIDProps extends PaperProps {
    exam_id: number;
}

export default function ExamResultsByID({exam_id, ...props}: IExamResultsByIDProps) {
    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(loadExamResultsAsync(exam_id));
    }, [exam_id]);
    return (
        <Paper elevation={0} {...props}>
            <Table>
                <UiExamTableHead/>
                <UIExamsResultsTableBody/>
            </Table>
        </Paper>
    )
}
