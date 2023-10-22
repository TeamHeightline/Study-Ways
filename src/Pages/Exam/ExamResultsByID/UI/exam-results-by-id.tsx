import {Paper, Stack, Table, TableContainer} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadExamResultsAsync} from "../redux-store/async-actions";
import UiExamTableHead from "./ui-exam-table-head";
import UIExamsResultsTableBody from "./ui-exam-resuls-table-body";
import UIAutoUpdateFlag from "./ui-auto-update-flag";
import {changeExamID, createArrayForChart, createExamResultsOrderBySum} from "../redux-store/actions";
import UIExamFinalResultChart from "./ui-exam-final-result-chart";
import ShowResultsBySumFlag from "./ui-show-results-by-sum-flag";
import {RootState} from "../../../../ReduxStore/RootStore";

interface IExamResultsByIDProps extends PaperProps {
    exam_id: number;
}

export default function ExamResultsByID({exam_id, ...props}: IExamResultsByIDProps) {
    const dispatch: any = useDispatch();
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)

    useEffect(() => {
        dispatch(changeExamID(exam_id));
        dispatch(loadExamResultsAsync(exam_id));
    }, [exam_id])

    useEffect(() => {
        dispatch(createArrayForChart())
        dispatch(createExamResultsOrderBySum())
    }, [examResults])
    return (
        <Paper elevation={0} {...props}>
            <UIExamFinalResultChart/>
            <Stack alignItems="end">
                <Stack alignItems="start">
                    <UIAutoUpdateFlag/>
                    <ShowResultsBySumFlag/>
                </Stack>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <UiExamTableHead/>
                    <UIExamsResultsTableBody/>
                </Table>
            </TableContainer>
        </Paper>
    )
}
