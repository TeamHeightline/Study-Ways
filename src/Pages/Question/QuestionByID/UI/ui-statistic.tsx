import { Box, Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import { observer } from 'mobx-react';
import React from 'react';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import { QuestionPlayerStore } from '../Store/QuestionPlayerStore';
import { StatisticChart } from '../../../DetailStatistic/UI/StatisticChart';

interface IUIStatisticProps extends BoxProps {
  questionStore: QuestionPlayerStore;
  restartQuestion: () => void;
}

const UIStatistic = observer(({ questionStore, restartQuestion, ...props }: IUIStatisticProps) => (
  <Box {...props} className="sw-question-completion">
    <div className="sw-question-completion-header">
      <span className="sw-question-completion-icon">{questionStore.isAcceptDefeat ? <ReplayRoundedIcon /> : <TaskAltRoundedIcon />}</span>
      <div className="sw-question-completion-copy">
        <h2>{questionStore.isAcceptDefeat ? 'Попробуйте ещё раз' : 'Вопрос пройден'}</h2>
        <p>{questionStore.isAcceptDefeat ? 'Вы завершили вопрос без решения. К нему можно вернуться.' : 'Посмотрите, как менялся результат по попыткам.'}</p>
        <span className="sw-question-completion-count">Попыток: {questionStore.numberOfPasses}</span>
      </div>
      <Button variant="outlined" startIcon={<ReplayRoundedIcon />} onClick={restartQuestion}>Пройти заново</Button>
    </div>
    <StatisticChart row={{ ArrayOfNumberOfWrongAnswers: questionStore.chartDataNumberOfWrongAnswers, ArrayForShowAnswerPoints: questionStore.chartDataArrayForShowAnswerPoints }} />
  </Box>
));
export default UIStatistic;
