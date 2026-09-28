import { TableCell, TableHead, TableRow, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import React from 'react';
import { RootState } from '../../../../App/ReduxStore/RootStore';
export default function UiExamTableHead() {
  const results = useSelector((state: RootState) => state.examResultsByIDReducer.exam_results);
  return <TableHead><TableRow>
    <TableCell><span className="sw-exam-sr-only">Подробности</span></TableCell>
    <TableCell>Участник</TableCell><TableCell>Группа</TableCell>
    {results?.[0]?.question_statuses?.map(question => <TableCell align="center" key={question.question_id}><Tooltip title={question.usertests_question?.text || ''}><span className="sw-exam-question-heading">Вопрос<span>№ {question.question_id}</span></span></Tooltip></TableCell>)}
    <TableCell align="right">Сумма баллов</TableCell>
  </TableRow></TableHead>;
}
