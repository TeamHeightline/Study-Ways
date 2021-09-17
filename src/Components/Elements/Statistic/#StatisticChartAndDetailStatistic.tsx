import {observer} from "mobx-react";
import React from "react";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionDataStore";
import {Collapse} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import {createStyles, makeStyles} from "@material-ui/core/styles";
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