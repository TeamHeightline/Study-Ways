import {observer} from "mobx-react";
import React from "react";
import {CircularProgress, Grid, Stack} from "@mui/material";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {StatisticChartAndDetailStatistic} from "./#StatisticChartAndDetailStatistic";
import {StatisticSearchByUserName} from "./#StatisticSearchByUserName";
import {StatisticSelectQuestionInQS} from "./#StatisticSelectQuestionInQS";
import {StatisticOnlyInQSFlag} from "./#StatisticOnlyInQSFlag";
import {StatisticOnlyExamMode} from "./#StatisticOnlyExamMode";
import {StatisticGoToMainPage} from "./#StatisticGoToMainPage";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {PaginationForStatistic} from "./#Pagination";
import {toJS} from "mobx";
import {DivideValue} from "./#DivideValue";
import {CreateAfterDateAndTimePicker} from "./#CreateAfterDateAndTimePicker";

export const StatisticByQuestionsData = observer(() =>{
    const isMobile = isMobileHook()
    if(!StatisticPageStoreObject.questionDataHasBeenLoaded || !StatisticPageStoreObject.allAttemptDataHasBeenLoaded){
        return (
            <div>
                {StatisticPageStoreObject.activePageOnTopMenu !==2 &&
                    <Grid container style={{paddingLeft: isMobile? 0 : 48}}>
                        <Grid item xs={12} md={2} style={{marginTop: 20}}>
                            <StatisticGoToMainPage/>
                        </Grid>
                    </Grid>}
                <Stack alignItems={"center"}>
                    <CircularProgress />
                </Stack>
            </div>
        )
    }
    return(
        <div>
            {StatisticPageStoreObject.activePageOnTopMenu !==2 &&
            <Grid container style={{paddingLeft: isMobile? 0 : 48}}>
                <Grid item xs={12} md={2} style={{marginTop: 20}}>
                    <StatisticGoToMainPage/>
                </Grid>
            </Grid>}
            <Grid container style={{paddingLeft: isMobile ? 0 : 48}}>
                <Grid item xs={12} md={2} style={{marginTop: 20}}>
                    <StatisticSearchByUserName/>
                </Grid>
                {StatisticByQuestionDataStoreObject?.multiQuestionMode &&
                <React.Fragment>
                    <Grid item xs={12} md={2} style={{marginLeft: isMobile ? 0 : 20, marginTop: 20}}>
                        <StatisticSelectQuestionInQS/>
                    </Grid>
                    <Grid item xs={12} md={2} style={{marginLeft: isMobile ? 0 : 20, marginTop: 20}}>
                        <StatisticOnlyInQSFlag/>
                    </Grid>
                </React.Fragment>}
                <Grid item xs={12} md={2} style={{marginLeft: isMobile ? 0 : 20, marginTop: 20}}>
                    <StatisticOnlyExamMode/>
                </Grid>
                <Grid item xs={12} md={2} style={{marginLeft: isMobile ? 0 : 20, marginTop: 20}}>
                    <CreateAfterDateAndTimePicker/>
                </Grid>
                <Grid item xs={12} md={1} style={{marginLeft: isMobile ? 0 : 20, marginTop: 20}}>
                    <DivideValue/>
                </Grid>

            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Имя пользователя</TableCell>
                            <TableCell align="right">Вошел/не вошел в систему</TableCell>
                            {StatisticByQuestionDataStoreObject?.multiQuestionMode &&
                            <TableCell align="right">ID вопроса </TableCell>}
                            <TableCell align="right">Количество попыток</TableCell>
                            <TableCell align="right">Среднее количество ошибок</TableCell>
                            <TableCell align="right">Всего ошибок</TableCell>
                            <TableCell align="right">Среднее/максимальное количество баллов</TableCell>
                            <TableCell align="right">% выполнения (в зависимости от коэффициента)</TableCell>
                            <TableCell align="right">Дата и время окончания попытки</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {StatisticByQuestionDataStoreObject?.objectRows.map((row, rIndex) => {
                            if(rIndex < StatisticByQuestionDataStoreObject.rowLimit)
                                return(
                                <React.Fragment key={rIndex + "Key"}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton aria-label="expand row" size="small"
                                                    onClick={() => StatisticByQuestionDataStoreObject.changeRowsForDetailStatistic(toJS(row.attemptID))}>
                                        {StatisticByQuestionDataStoreObject?.rowsOpenForDetailStatistic?.has(toJS(row.attemptID)) ?
                                            <KeyboardArrowUpIcon /> :
                                            <KeyboardArrowDownIcon />}
                                            {/*<KeyboardArrowUpIcon />*/}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.username}
                                    </TableCell>
                                    <TableCell align="right" style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.isLogin}
                                    </TableCell>
                                    {StatisticByQuestionDataStoreObject?.multiQuestionMode &&
                                        <TableCell align="right" style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                            {row.questionID}
                                        </TableCell>
                                    }
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.numberOfPasses}
                                    </TableCell>
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.arithmeticMeanNumberOfWrongAnswer}
                                    </TableCell>
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.numberOfWrongAnswers}
                                    </TableCell>
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.arithmeticMeanNumberOfAnswersPointsDivideToMaxPoints}
                                    </TableCell>
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.SumOFPointsWithNewMethod}
                                    </TableCell>
                                    <TableCell align="right"
                                               style={{color: row.questionHasBeenCompleted? "" :"rgb(245,0,87)"}}>
                                        {row.FormattedCreatedAt}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={StatisticByQuestionDataStoreObject?.multiQuestionMode ? 10 :9}
                                               style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <StatisticChartAndDetailStatistic row={row}/>
                                    </TableCell>
                                </TableRow>
                                </React.Fragment>
                            )}
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack alignItems={"center"}>
                <PaginationForStatistic/>
            </Stack>
        </div>
    )
})