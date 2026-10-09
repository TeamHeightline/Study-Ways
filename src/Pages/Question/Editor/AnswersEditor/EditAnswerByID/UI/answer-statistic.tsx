import React, { useEffect, useState } from 'react';
import { Box, BoxProps, Chip, Tooltip } from '@mui/material';
import { getAnswerStatistic } from '../Store/Query';
import { IAnswerStatistic } from '../Store/type';

interface AnswerStatisticProps extends BoxProps {
  answer_id: number;
}
export default function AnswerStatistic({
  answer_id,
  ...props
}: AnswerStatisticProps) {
  const [stats, setStats] = useState<IAnswerStatistic | null>(null);
  useEffect(() => {
    let active = true;
    setStats(null);
    getAnswerStatistic(answer_id)
      .then(data => {
        if (active) setStats(data);
      })
      .catch(() => void 0);
    return () => {
      active = false;
    };
  }, [answer_id]);
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
