import {TableBody} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";
import React from "react";
import UIExamResultTableRow from "./ui-exam-result-table-row";

interface IUIExamsResultsTableBodyProps extends PaperProps {

}

export default function UIExamsResultsTableBody({...props}: IUIExamsResultsTableBodyProps) {
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)
    return (
        <TableBody>
            {examResults?.map((exam_result, index) => {
                return (
                    <UIExamResultTableRow exam_result={exam_result} key={index}/>
                )
            })}
        </TableBody>
    )
}
