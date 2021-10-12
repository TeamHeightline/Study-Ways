import {observer} from "mobx-react";
import React from 'react';
import {Grid} from "@material-ui/core";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";

export const StatisticChart = observer(({row}) =>{
    return(
        <div>
            <Grid container justify="space-around">
                <Grid item xs={6} md={5}>
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
                <Grid item xs={6} md={5}>
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
        </div>
    )
})