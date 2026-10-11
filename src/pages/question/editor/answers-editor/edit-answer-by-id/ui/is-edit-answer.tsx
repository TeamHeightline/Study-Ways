import React from 'react';
import { Button, PaperProps } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IsEditAnswerProps extends PaperProps {
  answer_object: AnswerEditorController;
}
const IsEditAnswer = ({ answer_object: store }: IsEditAnswerProps) => (
  <Button
    startIcon={<TuneRoundedIcon />}
    endIcon={
      store.isOpenForEdit ? (
        <ExpandLessRoundedIcon />
      ) : (
        <ExpandMoreRoundedIcon />
      )
    }
    onClick={store.changeIsOpenForEdit}
    aria-expanded={store.isOpenForEdit}
    aria-controls={`qedit-answer-settings-${store.answer_id}`}
    className="sw-qedit-expand-answer"
  >
    {store.isOpenForEdit ? 'Свернуть редактор' : 'Настройки и подсказки'}
  </Button>
);
export default IsEditAnswer;
