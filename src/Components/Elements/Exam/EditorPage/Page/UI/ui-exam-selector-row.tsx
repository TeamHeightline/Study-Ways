import {TableCell, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {IExamDataWithQSData} from "../../../../../../ServerLayer/Types/exam.types";
import {useHistory} from "react-router-dom";

interface IUIExamSelectorRowProps extends PaperProps {
    exam: IExamDataWithQSData
}

export default function UIExamSelectorRow({exam, ...props}: IUIExamSelectorRowProps) {
    const history = useHistory();

    function openExamForEdit() {
        history.push("/editor/exam/select/" + exam.id)
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
