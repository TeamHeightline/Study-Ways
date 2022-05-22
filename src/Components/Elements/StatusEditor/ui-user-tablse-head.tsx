import {Paper, TableCell, TableHead, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IUIUserProfileHeadProps extends PaperProps {

}

export default function UIUserProfileHead({...props}: IUIUserProfileHeadProps) {
    return (
        <TableHead>
            <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Фамилия</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Место учебы/преподавания</TableCell>
                <TableCell>Статус</TableCell>
            </TableRow>
        </TableHead>
    )
}
