import React from 'react';
import { Button } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAppDispatch } from '../../../../../App/ReduxStore/RootStore';
import { openCreateQuestionDialog } from '../redux-store/QuestionEditorPageSlice';

export function UiCreateNewQuestion() {
  const dispatch = useAppDispatch();
  return (
    <Button
      startIcon={<AddRoundedIcon />}
      variant="contained"
      disableElevation
      className="sw-qedit-create"
      onClick={() => dispatch(openCreateQuestionDialog())}
    >
      Новый вопрос
    </Button>
  );
}
