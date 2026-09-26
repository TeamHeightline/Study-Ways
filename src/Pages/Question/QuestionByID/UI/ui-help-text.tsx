import { Alert, AlertTitle, Box } from '@mui/material';
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded';
import { BoxProps } from '@mui/material/Box/Box';
import { observer } from 'mobx-react';
import { QuestionPlayerStore } from '../Store/QuestionPlayerStore';
import React from 'react';

interface IUIHelpTextProps extends BoxProps {
  questionStore: QuestionPlayerStore;
}

const UIHelpText = observer(({ questionStore, ...props }: IUIHelpTextProps) => (
  <Box className="sw-question-help-wrap" {...props}>
    {questionStore?.oneTimeCheckError &&
      questionStore?.IndexOfMostWantedError !== -1 && (
        <div>
          <Alert
            className="sw-question-help"
            severity="warning"
            variant="outlined"
            icon={<TipsAndUpdatesRoundedIcon />}
          >
            <AlertTitle>Подсказка</AlertTitle>
            <span>{questionStore?.HelpTextForShow}</span>
          </Alert>
        </div>
      )}
  </Box>
));

export default UIHelpText;
