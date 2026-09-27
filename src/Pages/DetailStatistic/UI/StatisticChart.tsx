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
    x: { offset: true, grid: { display: false }, border: { display: false }, ticks: { color: '#66806d', maxRotation: 0, font: { size: 10 } } },
    y: { beginAtZero: true, grid: { drawTicks: false, color: (context) => context.tick.value === 0 ? '#93b09b' : '#edf2ee' }, border: { display: false }, ticks: { maxTicksLimit: 3, precision: 0, padding: 8, color: '#829188', font: { size: 10 } } },
  },
};

const toLabels = (items) => items.map((item) => String(Math.round(Number(item.numberOfPasses))));

const ProgressSummary = ({ items, field, lowerIsBetter = false }) => {
  if (!items.length) return null;
  const first = Number(items[0][field]);
  const last = Number(items[items.length - 1][field]);
  const delta = last - first;
  const improved = lowerIsBetter ? delta < 0 : delta > 0;
  return <div className="sw-chart-summary">
    <strong>{items.length > 1 ? `${first} → ${last}` : last}</strong>
    <span>{items.length > 1 ? 'первая → последняя попытка' : 'первая попытка'}</span>
    {items.length > 1 && <small className={delta === 0 ? '' : improved ? 'is-better' : 'is-worse'}>{delta === 0 ? 'Без изменений' : `${delta > 0 ? '+' : '−'}${Math.abs(delta)}`}</small>}
  </div>;
};

export const StatisticChart = observer(({ row }) => {
  const wrongAnswers = row.ArrayOfNumberOfWrongAnswers || [];
  const answerPoints = row.ArrayForShowAnswerPoints || [];
  return (
    <div className="sw-results-chart">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="sw-results-chart-heading"><span className="sw-results-chart-dot is-error" /><span>Ошибки · меньше — лучше</span></div>
          <ProgressSummary items={wrongAnswers} field="numberOfWrongAnswers" lowerIsBetter />
          <div className="sw-results-chart-canvas"><Bar options={chartOptions} data={{ labels: toLabels(wrongAnswers), datasets: [{ data: wrongAnswers.map((item) => item.numberOfWrongAnswers), backgroundColor: '#d47b73', hoverBackgroundColor: '#b85f59', borderRadius: 7, borderSkipped: false, maxBarThickness: 34 }] }} /></div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="sw-results-chart-heading"><span className="sw-results-chart-dot is-points" /><span>Баллы · выше — лучше</span></div>
          <ProgressSummary items={answerPoints} field="answerPoints" />
          <div className="sw-results-chart-canvas"><Bar options={chartOptions} data={{ labels: toLabels(answerPoints), datasets: [{ label: 'Баллы', data: answerPoints.map((item) => item.answerPoints), backgroundColor: answerPoints.map(item => Number(item.answerPoints) < 0 ? '#d47b73' : '#4d8a63'), borderRadius: 7, borderSkipped: false, maxBarThickness: 34 }] }} /></div>
        </Grid>
      </Grid>
    </div>
  );
});
