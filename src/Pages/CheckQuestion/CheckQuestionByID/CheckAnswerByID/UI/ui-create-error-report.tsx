import { observer } from 'mobx-react';
import React from 'react';
import { Button, Paper, PaperProps } from '@mui/material';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import { CheckAnswerByIdStore } from '../Store/check-answer-by-id-store';

interface IUICreateErrorReportProps extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UICreateErrorReport = observer(
  ({ answerStore, className = '', ...props }: IUICreateErrorReportProps) => (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-action-wrapper ${className}`}
    >
      <Button
        className="sw-review-report-button"
        variant="outlined"
        size="small"
        startIcon={<OutlinedFlagRoundedIcon />}
        onClick={answerStore.openAnswerReportDialog}
      >
        Сообщить об ошибке
      </Button>
    </Paper>
  ),
);

export default UICreateErrorReport;
