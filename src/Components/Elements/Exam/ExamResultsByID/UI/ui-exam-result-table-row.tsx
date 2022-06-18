import {TableCell, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";
import {IExamResult} from "../../../../../ServerLayer/Types/exam.types";
import UIExamEachAttemptTable from "./ui-exam-each-attempt-table";

interface IUIExamResultTableRowProps extends PaperProps {
    exam_result: IExamResult
}

export default function UIExamResultTableRow({exam_result, ...props}: IUIExamResultTableRowProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton size="small"
                                onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ?
                            <KeyboardArrowUpIcon/> :
                            <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell>{exam_result?.users_customuse?.username}</TableCell>
                <TableCell>
                    {exam_result?.users_customuser?.users_userprofile?.firstname + " "}
                    {exam_result?.users_customuser?.users_userprofile?.lastname}
                </TableCell>
                {exam_result?.question_statuses?.map((question_status) => {
                    return (
                        <TableCell key={question_status.question_id}>{question_status?.percent}</TableCell>
                    )
                })}
                <TableCell>{exam_result?.sumOfAllPasses}</TableCell>
            </TableRow>

            <UIExamEachAttemptTable exam_result={exam_result} isOpen={isOpen}/>

        </React.Fragment>

    )
}
