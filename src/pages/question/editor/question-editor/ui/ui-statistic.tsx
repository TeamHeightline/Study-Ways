import React, { useEffect, useState } from 'react';
import { Box, BoxProps, Chip, Tooltip } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import { useQuestionEditor } from '../store/use-question-editor';
import { getQuestionStatistic, IQuestionStatistic } from '../store/Struct';
const UIQuestionStatistic = (props: BoxProps) => {
  const editor = useQuestionEditor();
  const [stats, setStats] = useState<IQuestionStatistic | null>(null);
  const id = editor.selectedQuestionID;
  useEffect(() => {
    let active = true;
    setStats(null);
    if (id)
      getQuestionStatistic(id)
        .then(data => {
          if (active) setStats(data);
        })
        .catch(() => void 0);
    return () => {
      active = false;
    };
  }, [id]);
  if (stats?.training_avg == null && stats?.exam_avg == null) return null;
  return (
    <Box {...props} className="sw-qedit-statistics">
      {stats?.training_avg != null && (
        <Tooltip title="Средний результат в режиме подготовки">
          <Chip
            icon={<AutoStoriesOutlinedIcon />}
            label={`Подготовка · ${Math.ceil(stats.training_avg)}%`}
          />
        </Tooltip>
      )}
      {stats?.exam_avg != null && (
        <Tooltip title="Средний результат в режиме экзамена">
          <Chip
            icon={<SchoolOutlinedIcon />}
            label={`Экзамен · ${Math.ceil(stats.exam_avg)}%`}
          />
        </Tooltip>
      )}
    </Box>
  );
};
export default UIQuestionStatistic;
