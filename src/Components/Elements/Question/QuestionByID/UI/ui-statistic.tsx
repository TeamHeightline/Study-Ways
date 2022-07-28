import {Alert, Box, Button, Stack} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import React from "react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";

interface IUIStatisticProps extends BoxProps {
    questionStore: QuestionPlayerStore,
    restartQuestion: () => void
}


const UIStatistic = observer(({questionStore, restartQuestion, ...props}: IUIStatisticProps) => {

    // @ts-ignore
    return (
        <Box {...props}>
            <Alert severity={questionStore?.isAcceptDefeat ? "error" : "info"} variant="filled"
                   sx={{mt: 2}}>
                {questionStore?.isAcceptDefeat ? "Вы сдались.     " +
                    "Количество попыток - " + questionStore?.numberOfPasses :
                    "Вы прошли этот вопрос.     " +
                    "Количество попыток - " + questionStore?.numberOfPasses}
            </Alert>
            <Stack alignItems={"center"} sx={{pt: 2}}>
                <Button variant={"contained"} color="primary" onClick={restartQuestion}>
                    Пройти тест заново
                </Button>
            </Stack>
            <Stack direction={"row"} sx={{pt: 2}}>
                {/*
                    // @ts-ignore*/}
                <Chart data={questionStore?.ArrayForShowNumberOfWrongAnswers}>
                    <Title text="Количество ошибок на каждой из попыток"/>
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
                {/*
                    // @ts-ignore*/}
                <Chart data={questionStore?.ArrayForShowAnswerPoints}>
                    <BarSeries
                        valueField="answerPoints"
                        argumentField="numberOfPasses"
                    />
                    <SplineSeries
                        valueField="answerPoints"
                        argumentField="numberOfPasses"
                    />
                    <ArgumentAxis showGrid={true}/>
                    <ValueAxis/>
                    <Title text="Количество баллов на каждой из попыток"/>
                </Chart>
            </Stack>
        </Box>
    )
})

export default UIStatistic;