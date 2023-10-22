import {TableBody} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import React from "react";
import UIExamResultTableRow from "./ui-exam-result-table-row";
import {RootState} from "../../../../root-redux-store/RootStore";

interface IUIExamsResultsTableBodyProps extends PaperProps {

}

export default function UIExamsResultsTableBody({...props}: IUIExamsResultsTableBodyProps) {
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)
    const examResultsOrderBySum = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results_order_by_sum)
    const showResultsBySum = useSelector((state: RootState) => state?.examResultsByIDReducer?.show_results_by_sum)
    const resultsForTable = showResultsBySum ? examResultsOrderBySum : examResults
    return (
        <TableBody>
            {resultsForTable?.map((exam_result, index) => {
                return (
                    <UIExamResultTableRow exam_result={exam_result} key={index}/>
                )
            })}
        </TableBody>
    )
}
