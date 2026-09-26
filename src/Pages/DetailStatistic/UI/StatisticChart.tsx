// @ts-nocheck
import { observer } from 'mobx-react';
import React from 'react';
import { Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 450 },
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      backgroundColor: '#234b37',
      titleColor: '#dff0e2',
      bodyColor: '#ffffff',
      padding: 11,
      cornerRadius: 10,
      callbacks: { title: (items) => `Попытка ${items[0]?.label ?? ''}` },
    },
  },
  scales: {
    x: { offset: true, grid: { display: false }, border: { color: '#c7ddcc' }, ticks: { color: '#66806d', font: { size: 11, weight: '600' } } },
    y: { beginAtZero: true, grid: { color: '#e0ebe2' }, border: { color: '#c7ddcc' }, ticks: { color: '#66806d', font: { size: 10 } } },
  },
};

const toLabels = (items) => items.map((item) => String(Math.round(Number(item.numberOfPasses))));

export const StatisticChart = observer(({ row }) => {
  const wrongAnswers = row.ArrayOfNumberOfWrongAnswers || [];
  const answerPoints = row.ArrayForShowAnswerPoints || [];
  return (
    <div className="sw-results-chart">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="sw-results-chart-heading"><span className="sw-results-chart-dot is-error" /><span>Ошибки по попыткам</span></div>
          <div className="sw-results-chart-canvas"><Bar options={chartOptions} data={{ labels: toLabels(wrongAnswers), datasets: [{ data: wrongAnswers.map((item) => item.numberOfWrongAnswers), backgroundColor: '#d47b73', hoverBackgroundColor: '#b85f59', borderRadius: 7, borderSkipped: false, maxBarThickness: 34 }] }} /></div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="sw-results-chart-heading"><span className="sw-results-chart-dot is-points" /><span>Баллы по попыткам</span></div>
          <div className="sw-results-chart-canvas"><Bar options={chartOptions} data={{ labels: toLabels(answerPoints), datasets: [{ data: answerPoints.map((item) => item.answerPoints), backgroundColor: '#4d8a63', hoverBackgroundColor: '#347452', borderRadius: 7, borderSkipped: false, maxBarThickness: 34 }] }} /></div>
        </Grid>
      </Grid>
    </div>
  );
});
