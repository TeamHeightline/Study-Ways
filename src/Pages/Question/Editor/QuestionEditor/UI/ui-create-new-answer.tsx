import React from 'react';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { QuestionEditorStorage } from '../Store/QuestionEditorStorage';

export const CreateNewAnswer = observer(() => (
  <Button
    variant="contained"
    disableElevation
    startIcon={<AddRoundedIcon />}
    className="sw-qedit-add-answer"
    onClick={() => QuestionEditorStorage.createNewAnswer()}
  >
    Добавить ответ
  </Button>
));
