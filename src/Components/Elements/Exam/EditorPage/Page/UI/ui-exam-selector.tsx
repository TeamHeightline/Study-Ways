import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";

interface IUIExamSelectorProps extends PaperProps {

}

export default function UIExamSelector({...props}: IUIExamSelectorProps) {
    return (
        <Paper elevation={0} {...props}>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>№ экзамена</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Серия вопросов</TableCell>
                            <TableCell>Дата создания</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*{rows.map((row) => (*/}
                        {/*    <TableRow*/}
                        {/*        key={row.name}*/}
                        {/*        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}*/}
                        {/*    >*/}
                        {/*        <TableCell component="th" scope="row">*/}
                        {/*            {row.name}*/}
                        {/*        </TableCell>*/}
                        {/*        <TableCell >{row.calories}</TableCell>*/}
                        {/*        <TableCell >{row.fat}</TableCell>*/}
                        {/*        <TableCell >{row.carbs}</TableCell>*/}
                        {/*        <TableCell >{row.protein}</TableCell>*/}
                        {/*    </TableRow>*/}
                        {/*))}*/}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
