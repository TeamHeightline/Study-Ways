import {observer} from "mobx-react";
import React, {Fragment, useEffect, useState} from 'react';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {DetailStatisticStoreByID} from "../Store/DetailStatisticStoreByID";
import {Avatar, Skeleton, Stack, Tooltip} from "@mui/material";
import {ChartAndStepByStepStatistic} from "./ChartAndStepByStepStatistic";

interface IDetailStatisticByIDProps extends React.HTMLAttributes<HTMLDivElement> {
    attempt_id: number
}

export const DetailStatisticByID = observer(({attempt_id}: IDetailStatisticByIDProps) => {
    const [statisticByIDStore] = useState(new DetailStatisticStoreByID(attempt_id))
    useEffect(() => {
        statisticByIDStore.changeAttemptID(attempt_id)
    }, [attempt_id])
    const textColor = statisticByIDStore.dataForRow.questionHasBeenCompleted ? "" : "rgb(245,0,87)"
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
                           style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.username}
                </TableCell>
                <TableCell style={{color: textColor}}>
                    <Stack direction={"row"} justifyContent={"end"} spacing={2}>
                        <div>
                            {statisticByIDStore.dataForRow?.firstname || ""}
                            {" "}
                            {statisticByIDStore.dataForRow?.lastname || ""}
                        </div>
                        {statisticByIDStore.dataForRow.avatarSrc &&
                            <Avatar src={statisticByIDStore.dataForRow.avatarSrc}
                                    sx={{width: 24, height: 24}}/>}


                    </Stack>
                </TableCell>

                <Tooltip disableInteractive title={statisticByIDStore.dataForRow.QuestionTextForStatistic}>
                    <TableCell
                        style={{color: textColor}}>
                        {statisticByIDStore.dataForRow.questionID}
                    </TableCell>
                </Tooltip>

                <TableCell
                    style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.numberOfPasses}
                </TableCell>
                <TableCell
                    style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.arithmeticMeanNumberOfWrongAnswer}
                </TableCell>
                <TableCell
                    style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.numberOfWrongAnswers}
                </TableCell>
                <TableCell
                    style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints}
                </TableCell>
                <TableCell
                    style={{color: textColor}}>
                    {statisticByIDStore.dataForRow.SumOFPointsWithNewMethod}
                </TableCell>
                <TableCell
                    style={{color: textColor}}>
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
