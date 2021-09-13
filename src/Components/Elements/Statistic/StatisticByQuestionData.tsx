import {observer} from "mobx-react";
import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/StatisticByQuestionDataStore";
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export const StatisticByQuestionData = observer(() =>{
    console.log(StatisticByQuestionDataStoreObject?.rows)
    return(
        <div>
            <Grid container  justify="center">
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" className="text-center">
                        {"ID: " + StatisticByQuestionDataStoreObject?.questionID}
                        {" Текст:  " + StatisticByQuestionDataStoreObject?.questionText}
                    </Typography>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Имя пользователя</TableCell>
                            <TableCell align="right">Вошел/не вошел в систему</TableCell>
                            <TableCell align="right">Количество попыток</TableCell>
                            <TableCell align="right">Среднее количество ошибок</TableCell>
                            <TableCell align="right">Максимальное количество ошибок</TableCell>
                            <TableCell align="right">Среднее количество баллов</TableCell>
                            <TableCell align="right">Минимальное количество баллов</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {StatisticByQuestionDataStoreObject?.rows.map((row, rIndex) => {
                            return(
                                <TableRow key={rIndex + "Key"}>
                                <TableCell>
                                <IconButton aria-label="expand row" size="small" onClick={() => void(0)}>
                                {/*{true ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}*/}
                                    <KeyboardArrowUpIcon />
                                </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                {row[0]}
                                </TableCell>
                                <TableCell align="right">{row[1]}</TableCell>
                                <TableCell align="right">{row[2]}</TableCell>
                                <TableCell align="right">{row[3]}</TableCell>
                                <TableCell align="right">{row[4]}</TableCell>
                                <TableCell align="right">{row[5]}</TableCell>
                                <TableCell align="right">{row[6]}</TableCell>
                                </TableRow>
                            )}
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
})