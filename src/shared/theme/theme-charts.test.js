import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { themeActions } from './theme-store';
import { createThemeTestStore, readTheme } from './theme-test-utils';
const store = createThemeTestStore({
  examResultsByIDReducer: () => ({
    exam_results: [1, 2, 3, 4].map(i => ({
      sumOfAllPasses: i * 10,
      question_statuses: [{ statistic_id: i }],
      users_customuser: { username: 'Участник ' + i },
    })),
  }),
});
import { StatisticChart } from '../../pages/detail-statistic/ui/StatisticChart';
import UIExamFinalResultChart from '../../pages/exam/exam-results-by-id/ui/ui-exam-final-result-chart';

const act = React.act || legacyAct;
const mockCharts = [];
jest.mock('react-chartjs-2', () => ({
  Bar: props => {
    mockCharts.push(props);
    return <canvas />;
  },
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
        <Provider store={store}>
          <StatisticChart row={row} />
          <UIExamFinalResultChart />
        </Provider>,
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
      await act(async () => store.dispatch(themeActions.themeChanged(id)));
      const [errors, points, exam] = mockCharts;
      const palette = readTheme(store).palette;
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
    store.dispatch(themeActions.themeChanged('sage'));
    localStorage.clear();
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});
