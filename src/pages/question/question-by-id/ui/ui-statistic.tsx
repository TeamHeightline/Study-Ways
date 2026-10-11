import { Alert, Box, Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import React from 'react';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { QuestionPlayerStore } from '../store/QuestionPlayerStore';
import { StatisticChart } from '../../../detail-statistic/ui/StatisticChart';
import { ThemeManulNote } from '../../../../shared/theme/ThemeManulNote';
interface IUIStatisticProps extends BoxProps {
  questionStore: QuestionPlayerStore;
  restartQuestion: () => void;
}
const UIStatistic = ({
  questionStore,
  restartQuestion,
  ...props
}: IUIStatisticProps) => (
  <Box {...props} className="sw-question-completion">
    <div className="sw-question-completion-header">
      <span className="sw-question-completion-icon">
        {questionStore.isAcceptDefeat ? (
          <ReplayRoundedIcon />
        ) : (
          <TaskAltRoundedIcon />
        )}
      </span>
      <div className="sw-question-completion-copy">
        <h2>
          {questionStore.isAcceptDefeat
            ? 'Попробуйте ещё раз'
            : 'Вопрос пройден'}
        </h2>
        <p>
          {questionStore.isAcceptDefeat
            ? 'Вы завершили вопрос без решения. К нему можно вернуться.'
            : 'Посмотрите, как менялся результат по попыткам.'}
        </p>
        <span className="sw-question-completion-count">
          Попыток: {questionStore.numberOfPasses}
        </span>
      </div>
      <Button
        variant="outlined"
        startIcon={<ReplayRoundedIcon />}
        onClick={restartQuestion}
      >
        Пройти заново
      </Button>
    </div>
    {questionStore.statisticSaveError && (
      <Alert
        severity="error"
        action={
          <Button
            disabled={questionStore.statisticSaving}
            onClick={() => {
              void questionStore.saveDetailStatistic().catch(() => {});
            }}
          >
            Повторить
          </Button>
        }
      >
        Не удалось сохранить результат.
      </Alert>
    )}
    <ThemeManulNote context="completion" />
    <StatisticChart
      row={{
        ArrayOfNumberOfWrongAnswers:
          questionStore.chartDataNumberOfWrongAnswers,
        ArrayForShowAnswerPoints:
          questionStore.chartDataArrayForShowAnswerPoints,
      }}
    />
  </Box>
);
export default UIStatistic;
