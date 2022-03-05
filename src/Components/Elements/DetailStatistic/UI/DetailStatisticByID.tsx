import {observer} from "mobx-react";
import React, {Fragment, useEffect, useState} from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {DetailStatisticStoreByID} from "../Store/DetailStatisticStoreByID";
import {Skeleton, Tooltip} from "@mui/material";
import {ChartAndStepByStepStatistic} from "./ChartAndStepByStepStatistic";

interface IDetailStatisticByIDProps extends React.HTMLAttributes<HTMLDivElement> {
    attempt_id: number
}

export const DetailStatisticByID = observer(({attempt_id}: IDetailStatisticByIDProps) => {
    const [statisticByIDStore] = useState(new DetailStatisticStoreByID(attempt_id))
    useEffect(() => {
        statisticByIDStore.changeAttemptID(attempt_id)
    }, [attempt_id])
    if (statisticByIDStore.loadingData) {
        return (
            <TableRow>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((indexForKey) => {
                    return (
                        <TableCell key={indexForKey + "SkeletonKey"}>
                            <Skeleton variant="text" width={"100%"} height={"100%"}/>
                        </TableCell>
                    )
                })}
            </TableRow>
        )
    }
    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand statisticByIDStore.dataForRow" size="small"
                                onClick={() => statisticByIDStore.changeIsOpenDetailStatistic()}>
                        {statisticByIDStore.isOpenDetailStatistic ?
                            <KeyboardArrowUpIcon/> :
                            <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="statisticByIDStore.dataForRow"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.username}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.isLogin}
                </TableCell>

                <Tooltip disableInteractive title={statisticByIDStore.dataForRow.QuestionTextForStatistic}>
                    <TableCell align="right"
                               style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                        {statisticByIDStore.dataForRow.questionID}
                    </TableCell>
                </Tooltip>

                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.numberOfPasses}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.arithmeticMeanNumberOfWrongAnswer}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.numberOfWrongAnswers}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.SumOFPointsWithNewMethod}
                </TableCell>
                <TableCell align="right"
                           style={{color: statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"}}>
                    {statisticByIDStore.dataForRow.FormattedCreatedAt}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={10}
                           style={{paddingBottom: 0, paddingTop: 0}}>
                    <ChartAndStepByStepStatistic
                        statisticByIDStore={statisticByIDStore}
                        row={statisticByIDStore.dataForRow}
                        isOpen={statisticByIDStore.isOpenDetailStatistic}/>
                </TableCell>
            </TableRow>
        </Fragment>
    )
})