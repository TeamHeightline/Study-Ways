import {TableBody, TableCell, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {RootState} from "../../../../../root-redux-store/RootReducer";
import {useSelector} from "react-redux";

interface IUIExamsResultsTableBodyProps extends PaperProps {

}

export default function UIExamsResultsTableBody({...props}: IUIExamsResultsTableBodyProps) {
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results)
    return (
        <TableBody>
            {examResults?.map((exam_result, index) => {
                return (
                    <TableRow key={index}>
                        <TableCell>{exam_result.users_customuser.username}</TableCell>
                        <TableCell>
                            {exam_result.users_customuser.users_userprofile.firstname + " "}
                            {exam_result.users_customuser.users_userprofile.lastname}
                        </TableCell>
                        {exam_result?.question_statuses?.map((question_status) => {
                            return (
                                <TableCell key={question_status.question_id}>{question_status.percent}</TableCell>
                            )
                        })}
                        <TableCell>{exam_result.sumOfAllPasses}</TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    )
}
