import { Collapse, TableCell, TableRow } from '@mui/material';
import { PaperProps } from '@mui/material/Paper/Paper';
import { ShowStatisticTable } from '../../../Statistic/V2/show-statistic-for-selected-questions/ShowStatisticTable';
import React from 'react';
import { IExamResult } from '../../../../Shared/ServerLayer/Types/exam.types';

interface IUIExamEachAttemptTableProps extends PaperProps {
  exam_result: IExamResult;
  isOpen: boolean;
}

export default function UIExamEachAttemptTable({
  exam_result,
  isOpen,
  ...props
}: IUIExamEachAttemptTableProps) {
  const attempt_id_array: number[] = [];

  exam_result?.question_statuses.forEach((questionStatus) => {
    if (questionStatus.statistic_id) {
      attempt_id_array.push(Number(questionStatus.statistic_id));
    }
  });

  return (
    <TableRow className="sw-exam-detail-row">
      <TableCell
        style={{ padding: 0, border: 0 }}
        colSpan={4 + exam_result?.question_statuses.length}
      >
        <Collapse
          in={isOpen}
          timeout="auto"
          unmountOnExit
          sx={{ overflowX: 'auto' }}
        >
          <div className="sw-exam-detail-content"><ShowStatisticTable attempt_id_array={attempt_id_array} /></div>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
