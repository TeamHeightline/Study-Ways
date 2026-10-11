import React from 'react';
import { Box, BoxProps, Chip, Tooltip } from '@mui/material';
import { useGetAnswerStatisticsQuery } from '../model/answer-editor-api';

export default function AnswerStatistic({
  answer_id,
  userId,
  ...props
}: BoxProps & { answer_id: number; userId: number }) {
  const { currentData: stats } = useGetAnswerStatisticsQuery({
    id: answer_id,
    userId,
  });
  if (!stats?.number_of_all_answer_choices) return null;
  const percent = Math.round(
    (1 -
      stats.number_of_incorrect_answer_choices /
        stats.number_of_all_answer_choices) *
      100,
  );
  return (
    <Box {...props}>
      <Tooltip title="Доля верного выбора или пропуска этого варианта">
        <Chip variant="outlined" label={`Верный выбор · ${percent}%`} />
      </Tooltip>
    </Box>
  );
}
