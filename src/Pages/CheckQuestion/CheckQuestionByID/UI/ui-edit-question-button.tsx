import { observer } from 'mobx-react';
import React from 'react';
import { Button, Paper, PaperProps } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import { useNavigate } from 'react-router-dom';

interface IUIEditQuestionButtonProps extends PaperProps {
  question_id?: string;
}

const UIEditQuestionButton = observer(
  ({ question_id, className = '', ...props }: IUIEditQuestionButtonProps) => {
    const navigate = useNavigate();
    if (!question_id || UserStorage.userAccessLevel !== 'ADMIN') return null;
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
  },
);

export default UIEditQuestionButton;
