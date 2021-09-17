import {observer} from "mobx-react";
import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import {toJS} from "mobx";
import {Collapse, TableBody} from "@material-ui/core";
import {StatisticWrongAnswersForAttempt} from "./#StatisticWrongAnswersForAttempt";

export const StatisticEachAttemptStatistic = observer(({row, classes}) =>{
    return(
        <TableBody>
            {row[10]?.map((attempt, aIndex) =>{
                return(
                    <React.Fragment key={attempt.numberOfPasses + "DetailStatisticKey"}>
                        <TableRow>
                            <TableCell>
                                <IconButton  size="small"
                                             onClick={() => row[11]?.changeOpenAttemptForDetailStatistic(aIndex)}>
                                    {row[11]?.openAttemptForDetailStatistic?.has(aIndex) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    {/*<KeyboardArrowUpIcon />*/}
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {toJS(attempt.numberOfPasses)}
                            </TableCell>
                            <TableCell>
                                {toJS(row[10][Number(attempt.numberOfPasses) -1]).numberOfWrongAnswers.length}
                            </TableCell>
                            <TableCell>
                                {toJS(row[8][Number(attempt.numberOfPasses) -1]?.answerPoints)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0, maxWidth: window.innerWidth - 100 }}>
                                <Collapse in={row[11]?.openAttemptForDetailStatistic?.has(aIndex)}>
                                    <StatisticWrongAnswersForAttempt {...{row, attempt, classes, aIndex}}/>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </React.Fragment>
                )})}
        </TableBody>
    )
})