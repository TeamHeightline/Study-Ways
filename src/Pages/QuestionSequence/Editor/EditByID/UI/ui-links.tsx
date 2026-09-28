import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import { Paper } from '@mui/material';
import editQSStore from '../store/edit-question-sequence-sore';
const UILinks = observer((props: PaperProps) => (
  <Paper elevation={0} {...props} className="sw-sequence-links">
    <a href={'https://sw-university.com/qs/' + editQSStore.QuestionSequenceID} target="_blank" rel="noreferrer"><span>Режим обучения<small>Пройти вопросы в своём темпе</small></span><span aria-hidden="true">↗</span></a>
    <a href={'https://sw-university.com/qs/' + editQSStore.QuestionSequenceID + '?exam=true'} target="_blank" rel="noreferrer"><span>Режим экзамена<small>Открыть серию как экзамен</small></span><span aria-hidden="true">↗</span></a>
  </Paper>
));
export default UILinks;
