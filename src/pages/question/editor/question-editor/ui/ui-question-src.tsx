import React from 'react';
import { Button } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useQuestionEditor } from '../store/use-question-editor';
export const QuestionSrc = () => {
  const editor = useQuestionEditor();
  return (
    <div className="sw-qedit-mode-links">
      <span>Открыть вопрос как ученик</span>
      <div>
        <Button
          component="a"
          href={`https://sw-university.com/iq/${editor.selectedQuestionID}`}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Подготовка
        </Button>
        <Button
          component="a"
          href={`https://sw-university.com/iq/${editor.selectedQuestionID}?exam=true`}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<OpenInNewRoundedIcon />}
        >
          Экзамен
        </Button>
      </div>
    </div>
  );
};
