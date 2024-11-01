import {TableCell, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {IExamDataWithQSData} from "../../../../../Shared/ServerLayer/Types/exam.types";
import {useNavigate} from "react-router-dom";

interface IUIExamSelectorRowProps extends PaperProps {
    exam: IExamDataWithQSData
}

export default function UIExamSelectorRow({exam, ...props}: IUIExamSelectorRowProps) {
    const navigate = useNavigate();

    function openExamForEdit() {
        navigate("/editor/exam/select/" + exam.id)
    }

    return (
        <TableRow hover onClick={openExamForEdit}>
            <TableCell>{exam.id}</TableCell>
            <TableCell>{exam.name}</TableCell>
            <TableCell>№{exam.question_sequence_id} {exam?.question_sequence?.name}</TableCell>
            <TableCell>{window.origin + "/exam/" + exam.uid}</TableCell>
        </TableRow>
    )
}
