import {observer} from "mobx-react";
import React from "react";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/StatisticByQuestionDataStore";
import {Row} from "react-bootstrap";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {Collapse} from "@material-ui/core";
export const StatisticChart = observer(({row}) =>{
    return(
        <div>
            <Collapse in={StatisticByQuestionDataStoreObject?.rowsOpenForDetailStatistic?.has(row[7])} unmountOnExit>
                <Row className="justify-content-around mt-2">
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
                </Row>
            </Collapse>
        </div>
    )
})