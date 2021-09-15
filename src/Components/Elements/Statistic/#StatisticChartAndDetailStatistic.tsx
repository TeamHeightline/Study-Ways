import {observer} from "mobx-react";
import React from "react";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/StatisticByQuestionDataStore";
import {Row} from "react-bootstrap";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {Card, CardActionArea, Collapse, Grid, TableBody, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import IconButton from "@material-ui/core/IconButton";
import {toJS} from "mobx";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {createStyles, makeStyles} from "@material-ui/core/styles";
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
                <Grid container justify="space-around">
                    <Grid item xs={12} md={5}>
                        <Chart data={row[9]}>
                            <Title text="Количество ошибок на каждой из попыток" />
                            <ArgumentAxis showGrid={true}/>
                            <ValueAxis/>
                            <BarSeries
                                valueField="numberOfWrongAnswers"
                                argumentField="numberOfPasses"
                            />
                            <SplineSeries
                                valueField="numberOfWrongAnswers"
                                argumentField="numberOfPasses"
                            />
                        </Chart>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Chart  data={row[8]}>
                            <BarSeries
                                valueField="answerPoints"
                                argumentField="numberOfPasses"
                            />
                            <SplineSeries
                                valueField="answerPoints"
                                argumentField="numberOfPasses"
                            />
                            <ArgumentAxis showGrid={true} />
                            <ValueAxis />
                            <Title text="Количество баллов на каждой из попыток" />
                        </Chart>
                    </Grid>
                </Grid>

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
                                                    <div style={{overflowX: "scroll"}}>
                                                        <Row style={{width:  toJS(row[10][Number(attempt.numberOfPasses) -1])?.numberOfWrongAnswers.length * 410}}>
                                                            {toJS(row[10][Number(attempt.numberOfPasses) -1])?.numberOfWrongAnswers?.map((errorAnswer) =>{
                                                                const answerObjectStorage = StatisticByQuestionDataStoreObject?.answersArrayDataStore.find((answer) => Number(answer.id) == Number(errorAnswer))
                                                                return(
                                                                    <div key={errorAnswer + "Error Answer Key" + attempt.numberOfPasses + "DetailStatisticKey"}>
                                                                        <Card  key={aIndex} variant="outlined" elevation={2} className={classes.root}
                                                                               style={{borderColor: answerObjectStorage.isTrue? "#2296F3" : "#f50057",}}
                                                                               >
                                                                            <CardActionArea>
                                                                                {answerObjectStorage?.answerImageUrl &&
                                                                                    <CardMedia
                                                                                        // style={{opacity: processedStore?.selectedAnswers?.has(answer?.id)? 0.5 : 1}}
                                                                                        className={answerObjectStorage?.answerText? classes.media : classes.fullHeightMedia}
                                                                                        image={answerObjectStorage?.answerImageUrl}
                                                                                    />}
                                                                                {answerObjectStorage?.answerText &&
                                                                                <CardContent className="mb-5">
                                                                                    <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                                                                        {answerObjectStorage?.answerText}
                                                                                    </Typography>
                                                                                </CardContent>}
                                                                            </CardActionArea>
                                                                        </Card>
                                                                    </div>
                                                                )
                                                            })}
                                                        </Row>
                                                    </div>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    )
})