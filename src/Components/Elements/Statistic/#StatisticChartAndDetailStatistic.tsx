import {observer} from "mobx-react";
import React from "react";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";
import {Collapse} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {StatisticChart} from "./#StatisticChart";
import {StatisticEachAttemptStatistic} from "./#StatisticEachAttemptStatistic";
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            width: 385,
            height: 400,
            marginLeft: 20,
            marginTop: 20
        },
        media: {
            height: 240,
        },
        fullHeightMedia: {
            height: 400
        },
    }),
);


export const StatisticChartAndDetailStatistic = observer(({row}) =>{
    const classes = useStyles();
    return(
        <div>
            <Collapse in={StatisticByQuestionDataStoreObject?.rowsOpenForDetailStatistic?.has(row[7])} unmountOnExit>
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
                        <StatisticEachAttemptStatistic {...{row, classes}}/>
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    )
})