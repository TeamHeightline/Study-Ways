import {TableCell, TableHead, TableRow, Tooltip, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import React from "react";
import {RootState} from "../../../../ReduxStore/RootStore";

interface IUIExamsTableHeadProps extends PaperProps {

}

export default function UiExamTableHead({...props}: IUIExamsTableHeadProps) {
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)

    return (
        <TableHead>
            <TableRow>
                <TableCell/>
                <TableCell>email пользователя</TableCell>
                <TableCell>Фамилия и имя</TableCell>
                {examResults && examResults[0]?.question_statuses?.map((question_status) => {
                    return (
                        <TableCell key={question_status.question_id}>
                            <Tooltip title={question_status?.usertests_question?.text || ""}>
                                <Typography>
                                    Вопрос №{question_status.question_id}
                                </Typography>
                            </Tooltip>
                        </TableCell>
                    )
                })}
                <TableCell>Сумма баллов</TableCell>
            </TableRow>
        </TableHead>
    )
}
