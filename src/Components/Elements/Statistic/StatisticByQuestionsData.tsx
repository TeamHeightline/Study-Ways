import {observer} from "mobx-react";
import React from "react";
import {Grid} from "@mui/material";
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
import {StatisticRowLimit} from "./#StatisticRowLimit";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

export const StatisticByQuestionsData = observer(() =>{
    const isMobile = isMobileHook()
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
                    <StatisticRowLimit/>
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
                            <TableCell align="right">Максимальное количество ошибок</TableCell>
                            <TableCell align="right">Среднее количество баллов</TableCell>
                            <TableCell align="right">Минимальное количество баллов</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {StatisticByQuestionDataStoreObject?.rows.map((row, rIndex) => {
                            if(rIndex < StatisticByQuestionDataStoreObject.rowLimit)
                                return(
                                <React.Fragment key={rIndex + "Key"}>
                                <TableRow>
                                    <TableCell>
                                        <IconButton aria-label="expand row" size="small"
                                                    onClick={() => StatisticByQuestionDataStoreObject.changeRowsForDetailStatistic(row[7])}>
                                        {StatisticByQuestionDataStoreObject?.rowsOpenForDetailStatistic?.has(row[7]) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            {/*<KeyboardArrowUpIcon />*/}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row"
                                               style={{color: row[12]? "" :"rgb(245,0,87)"}}>
                                        {row[0]}
                                    </TableCell>
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[1]}</TableCell>
                                    {StatisticByQuestionDataStoreObject?.multiQuestionMode &&
                                        <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>
                                            {row[11]?.attemptData?.question?.id}
                                        </TableCell>
                                    }
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[2]}</TableCell>
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[3]}</TableCell>
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[4]}</TableCell>
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[5]}</TableCell>
                                    <TableCell align="right" style={{color: row[12]? "" :"rgb(245,0,87)"}}>{row[6]}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={StatisticByQuestionDataStoreObject?.multiQuestionMode ? 9 :8}
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
        </div>
    )
})