import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import ThemeStoreObject from '../../global-theme';
import { StatisticChart } from '../../Pages/DetailStatistic/UI/StatisticChart';
import UIExamFinalResultChart from '../../Pages/Exam/ExamResultsByID/UI/ui-exam-final-result-chart';

const act = React.act || legacyAct;
const mockCharts = [];
jest.mock('react-chartjs-2', () => ({
  Bar: props => {
    mockCharts.push(props);
    return <canvas />;
  },
}));
jest.mock('react-redux', () => ({
  useSelector: selector =>
    selector({
      examResultsByIDReducer: {
        exam_results: [1, 2, 3, 4].map(i => ({
          sumOfAllPasses: i * 10,
          question_statuses: [{ statistic_id: i }],
          users_customuser: { username: `Участник ${i}` },
        })),
      },
    }),
}));

test('mounted charts and quartile zones repaint using the newly selected palette', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const row = {
    ArrayOfNumberOfWrongAnswers: [
      { numberOfPasses: 1, numberOfWrongAnswers: 2 },
    ],
    ArrayForShowAnswerPoints: [{ numberOfPasses: 1, answerPoints: 12 }],
  };
  try {
    await act(async () =>
      root.render(
        <>
          <StatisticChart row={row} />
          <UIExamFinalResultChart />
        </>,
      ),
    );
    for (const id of [
      'forest',
      'graphite',
      'midnight',
      'high-contrast',
      'high-contrast-dark',
      'sage',
    ]) {
      mockCharts.length = 0;
      await act(async () => ThemeStoreObject.setTheme(id));
      const [errors, points, exam] = mockCharts;
      const palette = ThemeStoreObject.palette;
      expect(errors.data.datasets[0].backgroundColor).toBe(
        palette['chart-negative'],
      );
      expect(points.data.datasets[0].backgroundColor).toEqual([
        palette['chart-positive'],
      ]);
      expect(exam.options.scales.y.ticks.color).toBe(palette.secondary);
      expect(exam.options.plugins.tooltip.backgroundColor).toBe(
        palette.tooltip,
      );
      const fills = [];
      const ctx = {
        save() {},
        restore() {},
        fillRect() {
          fills.push(this.fillStyle);
        },
        fillText() {},
        beginPath() {},
        setLineDash() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
      };
      exam.plugins[0].beforeDraw({
        ctx,
        data: { labels: [1, 2, 3, 4] },
        chartArea: { left: 0, right: 400, top: 30, bottom: 200 },
      });
      expect(fills).toEqual(
        ['accent-50', 'accent-100', 'accent-150', 'accent-200'].map(
          key => palette[key],
        ),
      );
    }
  } finally {
    await act(async () => root.unmount());
    container.remove();
    ThemeStoreObject.setTheme('sage');
    localStorage.clear();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
