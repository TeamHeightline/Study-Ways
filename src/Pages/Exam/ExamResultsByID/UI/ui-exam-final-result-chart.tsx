// @ts-nocheck
import { Paper } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  SplineSeries,
  Title,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../App/ReduxStore/RootStore";

type IUIExamFinalResultChartProps = PaperProps;

export default function UIExamFinalResultChart({
  ...props
}: IUIExamFinalResultChartProps) {
  const resultArrayForChart = useSelector(
    (state: RootState) => state?.examResultsByIDReducer?.result_array_for_chart,
  );

  if (
    resultArrayForChart &&
    resultArrayForChart?.length &&
    resultArrayForChart.length > 1
  ) {
    return (
      <Paper elevation={0} {...props}>
        <Chart data={resultArrayForChart}>
          <BarSeries valueField="result" argumentField="index" />
          <SplineSeries valueField="result" argumentField="index" />
          <ArgumentAxis showGrid={true} />
          <ValueAxis />
          <Title text="Количество баллов на каждой из попыток" />
        </Chart>
      </Paper>
    );
  } else {
    return <div />;
  }
}
