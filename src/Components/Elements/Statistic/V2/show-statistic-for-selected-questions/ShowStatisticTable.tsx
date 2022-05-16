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
import {PaperProps} from "@mui/material/Paper/Paper";
import {Stack} from "@mui/material";

interface IShowStatisticTableProps extends PaperProps{
    attempt_id_array: number[] | string[],
    stickyHeader?: boolean,
    pageChanger?: any
}
export const ShowStatisticTable = observer(({attempt_id_array, stickyHeader = false, pageChanger}: IShowStatisticTableProps) =>{
    return(
        <Stack direction={"column"} sx={{ width: '100%', overflow: 'hidden'}}>
            <TableContainer component={Paper} sx={{height: "auto", overflowY: "auto",
                maxHeight: stickyHeader?  window.innerHeight - 80: ""}}>
                <Table aria-label="collapsible table" stickyHeader={stickyHeader}
                       sx={{ minWidth:1200}}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Email пользователя</TableCell>
                            <TableCell align="right">Фамилия (если указана в профиле)</TableCell>
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
            {pageChanger}
        </Stack>
    )
})