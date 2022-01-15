import {observer} from "mobx-react";
import React from "react";

import {Collapse} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import {StatisticChart} from "../../Statistic/#StatisticChart";
import {StepByStepStatistic} from "./##StepByStepStatistic";
import {DSSObjectType, rowType} from "../Store/DetailStatisticStoreByID";

type props ={
    row: rowType,
    isOpen: boolean,
    statisticByIDStore: DSSObjectType
}

export const ChartAndStepByStepStatistic = observer(({row, isOpen, statisticByIDStore}: props) =>{
    return(
        <div>
            <Collapse in={isOpen} unmountOnExit>
                <StatisticChart row={row} />
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Номер попытки</TableCell>
                                <TableCell>Количество неправильных ответов</TableCell>
                                <TableCell>Количество баллов</TableCell>
                            </TableRow>
                        </TableHead>
                        {statisticByIDStore.ShowStepByStepStatistic &&
                            <StepByStepStatistic {...{row, statisticByIDStore}}/>}
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    )
})