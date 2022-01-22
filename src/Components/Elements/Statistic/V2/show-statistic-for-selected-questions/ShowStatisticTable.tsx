import {observer} from "mobx-react";
import React from 'react';
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import {DetailStatisticByID} from "../../../DetailStatistic/UI/DetailStatisticByID";

interface IShowStatisticTableProps extends React.HTMLAttributes<HTMLDivElement>{
    attempt_id_array: number[] | string[]
}
export const ShowStatisticTable = observer(({attempt_id_array, ...props}: IShowStatisticTableProps) =>{
    return(
        <div {...props}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Имя пользователя</TableCell>
                            <TableCell align="right">Вошел/не вошел в систему</TableCell>
                            <TableCell align="right">ID вопроса </TableCell>
                            <TableCell align="right">Количество попыток</TableCell>
                            <TableCell align="right">Среднее количество ошибок</TableCell>
                            <TableCell align="right">Всего ошибок</TableCell>
                            <TableCell align="right">Среднее/максимальное количество баллов</TableCell>
                            <TableCell align="right">% выполнения (в зависимости от коэффициента)</TableCell>
                            <TableCell align="right">Дата и время окончания попытки</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attempt_id_array.map((attempt_id) =>{
                                return(<DetailStatisticByID attempt_id={attempt_id} key={"attempt_by_id: " + attempt_id}/>)
                            })}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
})