import {observer} from "mobx-react";
import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {toJS} from "mobx";
import {Collapse, TableBody} from "@mui/material";
import {StatisticWrongAnswersForAttempt} from "./#StatisticWrongAnswersForAttempt";

export const StatisticEachAttemptStatistic = observer(({row, classes}) =>{
    return(
        <TableBody>
            {row.ArrayOfNumberOfWrongAnswers?.map((attempt, aIndex) =>{
                return(
                    <React.Fragment key={attempt.numberOfPasses + "DetailStatisticKey"}>
                        <TableRow>
                            <TableCell>
                                <IconButton  size="small"
                                             onClick={() => row.passedQuestion?.changeOpenAttemptForDetailStatistic(aIndex)}>
                                    {row.passedQuestion?.openAttemptForDetailStatistic?.has(aIndex) ?
                                        <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    {/*<KeyboardArrowUpIcon />*/}
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                {toJS(attempt.numberOfPasses)}
                            </TableCell>
                            <TableCell>
                                {toJS(row.ArrayForShowWrongAnswers[Number(attempt.numberOfPasses) -1]).numberOfWrongAnswers.length}
                            </TableCell>
                            <TableCell>
                                {toJS(row.ArrayForShowAnswerPoints[Number(attempt.numberOfPasses) -1]?.answerPoints)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0, maxWidth: window.innerWidth - 100 }}>
                                <Collapse in={row.passedQuestion?.openAttemptForDetailStatistic?.has(aIndex)} unmountOnExit>
                                    <StatisticWrongAnswersForAttempt {...{row, attempt, classes, aIndex}}/>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </React.Fragment>
                )})}
        </TableBody>
    )
})