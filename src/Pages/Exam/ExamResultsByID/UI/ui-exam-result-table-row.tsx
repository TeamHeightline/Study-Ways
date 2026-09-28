import { TableCell, TableRow, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';
import { IExamResult } from '../../../../Shared/ServerLayer/Types/exam.types';
import UIExamEachAttemptTable from './ui-exam-each-attempt-table';
export default function UIExamResultTableRow({ exam_result }: { exam_result: IExamResult }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const profile = exam_result.users_customuser?.users_userprofile;
  const name = [profile?.firstname, profile?.lastname].filter(Boolean).join(' ') || 'Имя не указано';
  return <>
    <TableRow className={'sw-exam-participant-row' + (isOpen ? ' is-expanded' : '')}>
      <TableCell><IconButton className="sw-exam-expand" size="small" aria-label={(isOpen ? 'Скрыть' : 'Показать') + ' результаты: ' + name} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell>
      <TableCell><div className="sw-exam-participant"><span className="sw-exam-avatar" aria-hidden="true">{[profile?.firstname, profile?.lastname].filter(Boolean).map(part => part[0]).join('').slice(0,2) || '?'}</span><div><strong>{name}</strong><span>{exam_result.users_customuser?.username || '—'}</span></div></div></TableCell>
      <TableCell><span className="sw-exam-group">{profile?.group || '—'}</span></TableCell>
      {exam_result.question_statuses?.map(question => <TableCell align="center" key={question.question_id}><span className={'sw-exam-score' + (question.percent == null ? ' is-empty' : question.percent < 0 ? ' is-negative' : question.percent > 0 ? ' is-positive' : '')}>{question.percent == null ? '—' : question.percent}</span></TableCell>)}
      <TableCell align="right"><strong className={'sw-exam-total' + (exam_result.sumOfAllPasses < 0 ? ' is-negative' : '')}>{exam_result.sumOfAllPasses ?? '—'}</strong></TableCell>
    </TableRow>
    <UIExamEachAttemptTable exam_result={exam_result} isOpen={isOpen} />
  </>;
}
