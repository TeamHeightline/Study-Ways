import {TableCell, TableHead, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IUIExamSelectorTableHeadProps extends PaperProps {

}

export default function UIExamSelectorTableHead({...props}: IUIExamSelectorTableHeadProps) {
    return (
        <TableHead>
            <TableRow>
                <TableCell>№ экзамена</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Серия вопросов</TableCell>
                <TableCell>Ссылка для прохождения</TableCell>
            </TableRow>
        </TableHead>
    )
}
