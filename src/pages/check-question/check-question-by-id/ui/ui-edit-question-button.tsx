import { useUserSession } from '../../../../shared/store/user-store/user-session';
import React from 'react';
import { Button, Paper, PaperProps } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';

interface IUIEditQuestionButtonProps extends PaperProps {
  question_id?: string;
}

const UIEditQuestionButton = ({
  question_id,
  className = '',
  ...props
}: IUIEditQuestionButtonProps) => {
  const session = useUserSession();
  const navigate = useNavigate();
  if (!question_id || session.role !== 'ADMIN') return null;
  return (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-action-wrapper ${className}`}
    >
      <Button
        variant="outlined"
        startIcon={<EditRoundedIcon />}
        onClick={() => navigate(`/editor/question/selected/${question_id}`)}
      >
        Редактировать вопрос
      </Button>
    </Paper>
  );
};

export default UIEditQuestionButton;
