import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const QuestionSrc = observer(() => (
  <div className="sw-qedit-mode-links">
    <span>Открыть вопрос как ученик</span>
    <div>
      <Button
        component="a"
        href={`https://sw-university.com/iq/${QuestionEditorStorage.selectedQuestionID}`}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<OpenInNewRoundedIcon />}
      >
        Подготовка
      </Button>
      <Button
        component="a"
        href={`https://sw-university.com/iq/${QuestionEditorStorage.selectedQuestionID}?exam=true`}
        target="_blank"
        rel="noopener noreferrer"
        endIcon={<OpenInNewRoundedIcon />}
      >
        Экзамен
      </Button>
    </div>
  </div>
));
