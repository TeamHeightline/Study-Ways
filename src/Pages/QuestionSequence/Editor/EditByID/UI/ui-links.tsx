import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Paper } from '@mui/material';
import { useSequenceEditor } from '../store/sequence-editor-context';
const UILinks = (props: PaperProps) => {
  const editQSStore = useSequenceEditor();
  return (
    <Paper elevation={0} {...props} className="sw-sequence-links">
      <a
        href={'https://sw-university.com/qs/' + editQSStore.QuestionSequenceID}
        target="_blank"
        rel="noreferrer"
      >
        <span>
          Режим обучения<small>Пройти вопросы в своём темпе</small>
        </span>
        <span aria-hidden="true">↗</span>
      </a>
      <a
        href={
          'https://sw-university.com/qs/' +
          editQSStore.QuestionSequenceID +
          '?exam=true'
        }
        target="_blank"
        rel="noreferrer"
      >
        <span>
          Режим экзамена<small>Открыть серию как экзамен</small>
        </span>
        <span aria-hidden="true">↗</span>
      </a>
    </Paper>
  );
};
export default UILinks;
