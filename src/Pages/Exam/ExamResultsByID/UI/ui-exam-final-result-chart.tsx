import { Paper, Checkbox, FormControlLabel } from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import ThemeStoreObject from '../../../../global-theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../App/ReduxStore/RootStore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
const number = (value: number) =>
  value.toLocaleString('ru-RU', { maximumFractionDigits: 1 });

const quartileLabels = ['Нижние 25%', '25–50%', '50–75%', 'Топ 25%'];
// Boundaries fall between whole participant columns, never through a bar.
const quartileBounds = (count: number) =>
  [0, 1, 2, 3, 4].map(part => Math.round((count * part) / 4));
const quartileZones: Plugin<'bar'> = {
  id: 'examQuartileZones',
  beforeDraw(chart) {
    // Read the current palette at draw time, including after a theme switch.
    const palette = ThemeStoreObject.palette;
    const quartileBackgrounds = [
      palette['accent-50'],
      palette['accent-100'],
      palette['accent-150'],
      palette['accent-200'],
    ];
    const count = chart.data.labels?.length || 0;
    if (count < 4) return;
    const {
      ctx,
      chartArea: { left, right, top, bottom },
    } = chart;
    const bounds = quartileBounds(count);
    ctx.save();
    for (let group = 0; group < 4; group++) {
      const start = left + ((right - left) * bounds[group]) / count;
      const end = left + ((right - left) * bounds[group + 1]) / count;
      ctx.fillStyle = quartileBackgrounds[group];
      ctx.fillRect(start, top - 26, end - start, bottom - top + 26);
      ctx.fillStyle = group === 3 ? palette.accent : palette.secondary;
      ctx.font = `600 ${ThemeStoreObject.definition.accessibility === 'enhanced' ? 14 : 11}px ${ThemeStoreObject.definition.fontFamily || 'sans-serif'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        quartileLabels[group],
        (start + end) / 2,
        top - 13,
        end - start - 8,
      );
      if (group > 0) {
        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = palette['border-strong'];
        ctx.moveTo(start, top);
        ctx.lineTo(start, bottom);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};

const UIExamFinalResultChart = observer((props: PaperProps) => {
  const palette = ThemeStoreObject.palette;
  const results = useSelector(
    (state: RootState) => state.examResultsByIDReducer.exam_results,
  );
  const [hideUnstarted, setHideUnstarted] = useState(true);
  const sorted = [...(results || [])]
    .filter(item => Number.isFinite(item.sumOfAllPasses))
    .filter(
      item =>
        !hideUnstarted ||
        item.question_statuses?.some(question =>
          Boolean(question.statistic_id),
        ),
    )
    .sort((a, b) => a.sumOfAllPasses - b.sumOfAllPasses);
  const scores = sorted.map(item => item.sumOfAllPasses);
  const names = sorted.map(item => {
    const profile = item.users_customuser?.users_userprofile;
    return (
      [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') ||
      item.users_customuser?.username ||
      'Участник'
    );
  });
  const options: ChartOptions<'bar'> = {
    responsive: true,
    animation:
      ThemeStoreObject.definition.accessibility === 'enhanced'
        ? false
        : undefined,
    layout: { padding: { top: sorted.length >= 4 ? 28 : 0 } },
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: palette.tooltip,
        titleColor: palette['tooltip-ink'],
        bodyColor: palette['tooltip-ink'],
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          title: items => names[items[0]?.dataIndex] || '',
          label: item => 'Баллы: ' + number(Number(item.raw)),
          afterLabel: item =>
            sorted.length >= 4
              ? quartileLabels[
                  quartileBounds(sorted.length)
                    .slice(1)
                    .findIndex(end => item.dataIndex < end)
                ]
              : '',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: palette.secondary,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
          font: {
            size:
              ThemeStoreObject.definition.accessibility === 'enhanced'
                ? 14
                : 11,
          },
        },
        title: {
          display: true,
          text: 'Участники · по возрастанию баллов',
          color: palette.secondary,
          font: {
            size:
              ThemeStoreObject.definition.accessibility === 'enhanced'
                ? 14
                : 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: {
          color: context =>
            context.tick.value === 0
              ? palette['chart-axis']
              : palette['chart-grid'],
        },
        ticks: {
          color: palette.secondary,
          maxTicksLimit: 5,
          font: {
            size:
              ThemeStoreObject.definition.accessibility === 'enhanced'
                ? 14
                : 11,
          },
        },
        title: {
          display: true,
          text: 'Баллы',
          color: palette.secondary,
          font: {
            size:
              ThemeStoreObject.definition.accessibility === 'enhanced'
                ? 14
                : 11,
          },
        },
      },
    },
  };
  return (
    <Paper elevation={0} {...props} className="sw-exam-overview-chart">
      <div className="sw-exam-chart-heading">
        <div>
          <h3>Баллы участников</h3>
          <p>Один столбик — результат одного участника.</p>
        </div>
        <div className="sw-exam-chart-metrics">
          <div>
            <span>Участников</span>
            <strong>{sorted.length}</strong>
          </div>
          <div>
            <span>Средний балл</span>
            <strong>
              {scores.length
                ? number(
                    scores.reduce((sum, score) => sum + score, 0) /
                      scores.length,
                  )
                : '—'}
            </strong>
          </div>
          <div>
            <span>Лучший результат</span>
            <strong>
              {scores.length ? number(scores[scores.length - 1]) : '—'}
            </strong>
          </div>
        </div>
      </div>
      <FormControlLabel
        className="sw-exam-chart-filter"
        control={
          <Checkbox
            size="small"
            checked={hideUnstarted}
            onChange={(_, checked) => setHideUnstarted(checked)}
          />
        }
        label="Скрыть участников без пройденных вопросов"
      />
      {sorted.length > 0 ? (
        <>
          <div className="sw-exam-chart-scroll">
            <div
              className="sw-exam-chart-canvas"
              style={{
                minWidth: Math.max(
                  sorted.length >= 4 ? 460 : 280,
                  sorted.length * 16,
                ),
              }}
            >
              <Bar
                plugins={[quartileZones]}
                options={options}
                data={{
                  labels: sorted.map((_, index) => String(index + 1)),
                  datasets: [
                    {
                      label: 'Баллы',
                      data: scores,
                      backgroundColor: scores.map(score =>
                        score < 0
                          ? palette['chart-negative']
                          : palette['chart-positive'],
                      ),
                      hoverBackgroundColor: scores.map(score =>
                        score < 0
                          ? palette['chart-negative-hover']
                          : palette['chart-positive-hover'],
                      ),
                      borderRadius: 5,
                      maxBarThickness: 26,
                      minBarLength: 2,
                    },
                  ],
                }}
                role="img"
                aria-label={
                  'Баллы ' +
                  sorted.length +
                  ' участников. Подробные значения представлены в таблице ниже.'
                }
              />
            </div>
          </div>
          <p className="sw-exam-quartile-note">
            {sorted.length >= 4
              ? 'Четверти по числу участников: от меньшего результата к большему. Границы округлены до целых участников; одинаковые баллы могут попасть в соседние группы.'
              : 'Разделение на четверти появится, когда будет не менее 4 участников.'}
          </p>
        </>
      ) : (
        <div className="sw-sequence-empty" role="status">
          {hideUnstarted
            ? 'Пока нет участников с пройденными вопросами. Снимите галочку, чтобы показать всех.'
            : 'Пока нет результатов для отображения.'}
        </div>
      )}
    </Paper>
  );
});

export default UIExamFinalResultChart;
