import { Box, Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box/Box';
import { observer } from 'mobx-react';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import React from 'react';
import { QuestionPlayerStore } from '../Store/QuestionPlayerStore';

interface IUIUserMarkAndActionButtonsProps extends BoxProps {
  questionStore: QuestionPlayerStore;
  answerID: number;
  answerIndex: number;
}

const UIUserMarkAndActionButtons = observer(
  ({ questionStore, answerIndex, ...props }: IUIUserMarkAndActionButtonsProps) => (
    <Box {...props}>
      <Button className="sw-answer-report-button" variant="outlined" onClick={() => questionStore.onReportAnswerButtonClick(answerIndex)} startIcon={<ReportProblemRoundedIcon />}>
        Сообщить об ошибке в ответе
      </Button>
    </Box>
  ),
);

export default UIUserMarkAndActionButtons;
